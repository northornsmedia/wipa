'use server';

import { getSupabaseServerClient } from '@/lib/supabase-server';
import { supabase as browserSupabase } from '@/lib/supabase';
import { redisSafeGet, redisSafeSet, REDIS_KEYS } from '@/lib/redis';

function getDbClient() {
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return getSupabaseServerClient();
    }
  } catch (e) {}
  return browserSupabase;
}

export type GlobalSearchResult = {
  id: string;
  type: 'Person' | 'Firm' | 'Event' | 'Job';
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  path: string;
};

export async function searchGlobal(searchQuery: string, currentUserId?: string | null): Promise<GlobalSearchResult[]> {
  const cleanQuery = searchQuery
    ?.trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s@.&'\-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 80);
  if (!cleanQuery || cleanQuery.length < 2) return [];

  const cacheKey = REDIS_KEYS.globalSearch(cleanQuery);
  const cached = await redisSafeGet<GlobalSearchResult[]>(cacheKey);
  if (Array.isArray(cached)) {
    return currentUserId ? cached.filter((item) => !(item.type === 'Person' && item.id === currentUserId)) : cached;
  }

  const db = getDbClient();
  const pattern = `%${cleanQuery}%`;
  const [profilesResult, firmsResult, eventsResult, jobsResult] = await Promise.all([
    db.from('profiles')
      .select('id, full_name, role, practice_area, company, avatar_url, member_id')
      .or(`full_name.ilike.${pattern},practice_area.ilike.${pattern},company.ilike.${pattern},member_id.ilike.${pattern}`)
      .limit(8),
    db.from('business_profiles')
      .select('id, name, slug, type, logo_url')
      .or(`name.ilike.${pattern},type.ilike.${pattern}`)
      .limit(5),
    db.from('events')
      .select('id, title, category, location, cover_image_url')
      .or(`title.ilike.${pattern},category.ilike.${pattern},location.ilike.${pattern}`)
      .limit(5),
    db.from('jobs')
      .select('id, title, company, location')
      .eq('is_active', true)
      .or(`title.ilike.${pattern},company.ilike.${pattern},location.ilike.${pattern}`)
      .limit(5),
  ]);

  const results: GlobalSearchResult[] = [
    ...(profilesResult.data || []).map((profile: any) => ({
      id: String(profile.id), type: 'Person' as const, title: profile.full_name || 'WIPA Member',
      subtitle: profile.practice_area || profile.role || profile.company || 'WIPA Member',
      imageUrl: profile.avatar_url, path: `/platform/profile/${profile.id}`,
    })),
    ...(firmsResult.data || []).map((firm: any) => ({
      id: String(firm.id), type: 'Firm' as const, title: firm.name || 'IP Firm',
      subtitle: firm.type || 'Business profile', imageUrl: firm.logo_url,
      path: `/platform/business/${firm.slug || firm.id}`,
    })),
    ...(eventsResult.data || []).map((event: any) => ({
      id: String(event.id), type: 'Event' as const, title: event.title || 'WIPA Event',
      subtitle: event.location || event.category || 'Event', imageUrl: event.cover_image_url,
      path: `/platform/events/${event.id}`,
    })),
    ...(jobsResult.data || []).map((job: any) => ({
      id: String(job.id), type: 'Job' as const, title: job.title || 'IP opportunity',
      subtitle: [job.company, job.location].filter(Boolean).join(' · ') || 'Job listing',
      path: '/platform/jobs',
    })),
  ];

  await redisSafeSet(cacheKey, results, 120);
  return currentUserId ? results.filter((item) => !(item.type === 'Person' && item.id === currentUserId)) : results;
}

export async function searchProfiles(searchQuery: string, currentUserEmail?: string | null): Promise<any[]> {
  if (!searchQuery?.trim()) {
    return [];
  }

  const cleanQuery = searchQuery.trim().toLowerCase();
  const cacheKey = REDIS_KEYS.searchProfiles(cleanQuery);

  try {
    // 1. Check Redis Cache
    const cachedData = await redisSafeGet<any[]>(cacheKey);
    if (cachedData && Array.isArray(cachedData)) {
      if (currentUserEmail) {
        return cachedData.filter((p: any) => p.email !== currentUserEmail);
      }
      return cachedData;
    }

    // 2. Fetch from Supabase
    const db = getDbClient();
    const { data, error } = await db
      .from('profiles')
      .select('*')
      .ilike('full_name', `%${cleanQuery}%`)
      .limit(10);

    if (error || !data) {
      console.error("Supabase search error:", error?.message);
      return [];
    }

    // 3. Store in Redis
    await redisSafeSet(cacheKey, data, 180);

    if (currentUserEmail) {
      return data.filter((p: any) => p.email !== currentUserEmail);
    }

    return data;
  } catch (error) {
    console.error("Profiles search error:", error);
    return [];
  }
}

export async function getProfileByIdOrMemberId(identifier: string): Promise<any | null> {
  if (!identifier?.trim()) return null;
  const cleanId = identifier.trim();
  const cacheKey = REDIS_KEYS.profile(cleanId);

  try {
    // 1. Check Redis Cache
    const cached = await redisSafeGet<any>(cacheKey);
    if (cached && cached.id) {
      return cached;
    }

    // 2. Fetch from Supabase
    const db = getDbClient();
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);
    
    let query = db.from('profiles').select('*');
    if (isUUID) {
      query = query.eq('id', cleanId);
    } else {
      query = query.ilike('member_id', cleanId);
    }

    let { data, error } = await query.maybeSingle();

    // Secondary fallback: if not found by member_id, check if identifier matches full_name or email
    if (!data && !isUUID) {
      const { data: fallbackData } = await db
        .from('profiles')
        .select('*')
        .or(`full_name.ilike.%${cleanId}%,email.ilike.%${cleanId}%`)
        .limit(1)
        .maybeSingle();
      data = fallbackData;
    }

    if (data) {
      // 3. Cache both under cleanId and data.id in Redis for fast resolution
      await redisSafeSet(cacheKey, data, 300);
      if (data.id && data.id !== cleanId) {
        await redisSafeSet(REDIS_KEYS.profile(data.id), data, 300);
      }
      return data;
    }

    return null;
  } catch (err) {
    console.error("Error in getProfileByIdOrMemberId:", err);
    return null;
  }
}
