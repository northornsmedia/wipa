'use server';

import { supabase } from '@/lib/supabase';
import { redis } from '@/lib/redis';

const FEED_CACHE_KEY = 'wipa:feed:posts:v1';
const FEED_CACHE_TTL = 180; // 3 minutes TTL

export async function getFeedPostsAction(): Promise<{ data: any[]; fromCache: boolean }> {
  try {
    // 1. Try Upstash Redis Cache
    const cached = await redis.get(FEED_CACHE_KEY);
    if (cached) {
      console.log(`[Redis Hit] ${FEED_CACHE_KEY}`);
      let parsed = cached;
      if (typeof cached === 'string') {
        try {
          parsed = JSON.parse(cached);
        } catch (e) {}
      }
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { data: parsed, fromCache: true };
      }
    }
  } catch (err) {
    console.warn('[Redis Read Warning]', err);
  }

  // 2. Cache Miss: Fetch from Supabase
  console.log(`[Redis Miss] Fetching from Supabase: ${FEED_CACHE_KEY}`);
  const { data, error } = await supabase
    .from('feed_posts')
    .select(`
      *,
      author:profiles!feed_posts_author_id_fkey(full_name, avatar_url, practice_area, created_at, is_wipa_recommended)
    `)
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching feed from DB:', error);
    return { data: [], fromCache: false };
  }

  // 3. Populate Redis Cache
  try {
    await redis.set(FEED_CACHE_KEY, JSON.stringify(data), { ex: FEED_CACHE_TTL });
  } catch (err) {
    console.warn('[Redis Write Warning]', err);
  }

  return { data, fromCache: false };
}

export async function invalidateFeedCacheAction(): Promise<void> {
  try {
    await redis.del(FEED_CACHE_KEY);
    console.log(`[Redis Invalidate] ${FEED_CACHE_KEY}`);
  } catch (err) {
    console.warn('[Redis Invalidate Warning]', err);
  }
}
