'use server';

import { supabase } from '@/lib/supabase';
import { redisSafeGet, redisSafeSet, REDIS_KEYS } from '@/lib/redis';

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
    const { data, error } = await supabase
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
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);
    
    let query = supabase.from('profiles').select('*');
    if (isUUID) {
      query = query.eq('id', cleanId);
    } else {
      query = query.ilike('member_id', cleanId);
    }

    let { data, error } = await query.maybeSingle();

    // Secondary fallback: if not found by member_id, check if identifier matches full_name or email
    if (!data && !isUUID) {
      const { data: fallbackData } = await supabase
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
