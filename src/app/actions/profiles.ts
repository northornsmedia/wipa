'use server';

import { supabase } from '@/lib/supabase';
import { redis } from '@/lib/redis';

export async function searchProfiles(searchQuery: string, currentUserEmail?: string | null): Promise<any[]> {
  if (!searchQuery.trim()) {
    return [];
  }

  const cacheKey = `search:profiles:${searchQuery.toLowerCase()}`;

  try {
    // 1. Check Redis Cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log(`[Cache Hit] Redis: ${cacheKey}`);
      // Redis might return string or parsed object depending on the client. 
      // Upstash Redis usually parses JSON arrays automatically, but let's handle it safely:
      let parsed = cachedData;
      if (typeof cachedData === 'string') {
        try { parsed = JSON.parse(cachedData); } catch (e) {}
      }
      
      // Filter out current user from cached result dynamically
      if (currentUserEmail && Array.isArray(parsed)) {
        return parsed.filter((p: any) => p.email !== currentUserEmail);
      }
      return parsed;
    }

    console.log(`[Cache Miss] Supabase: ${cacheKey}`);
    
    // 2. Fetch from Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('full_name', `%${searchQuery}%`)
      .limit(5);

    if (error || !data) {
      console.error("Supabase search error:", error);
      return [];
    }

    // 3. Store in Redis (cache for 5 minutes)
    await redis.set(cacheKey, JSON.stringify(data), { ex: 300 });

    // Filter out current user before returning to client
    if (currentUserEmail) {
      return data.filter((p: any) => p.email !== currentUserEmail);
    }

    return data;
  } catch (error) {
    console.error("Redis search action error:", error);
    return [];
  }
}
