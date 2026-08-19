import { Redis } from '@upstash/redis';

const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || 'https://profound-basilisk-177105.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || 'gQAAAAAAArPRAAIgcDEyNGQ5YWY1YmFjNWI0ZGVlYTYyMTUwY2JjYTE2ODJmOQ',
});

export const redis = redisClient;

// Structured Redis Cache Keys Schema
export const REDIS_KEYS = {
  profile: (id: string) => `wipa:profile:${id}`,
  searchProfiles: (query: string) => `wipa:search:profiles:${query.toLowerCase().trim()}`,
  feedPosts: 'wipa:feed:posts:v2',
  userChatConversations: (userId: string) => `wipa:chat:conversations:${userId}`,
  userUnreadCount: (userId: string) => `wipa:chat:unread:${userId}`,
  eventList: 'wipa:events:all',
};

// Safe helper functions to guarantee zero crash if Redis is unavailable
export async function redisSafeGet<T>(key: string): Promise<T | null> {
  try {
    const data = await redisClient.get<T>(key);
    if (!data) return null;
    if (typeof data === 'string') {
      try {
        return JSON.parse(data) as T;
      } catch {
        return data as unknown as T;
      }
    }
    return data;
  } catch (err) {
    console.warn(`[Redis safeGet Warning for ${key}]:`, err);
    return null;
  }
}

export async function redisSafeSet(key: string, value: any, ttlSeconds: number = 300): Promise<boolean> {
  try {
    const payload = typeof value === 'string' ? value : JSON.stringify(value);
    await redisClient.set(key, payload, { ex: ttlSeconds });
    return true;
  } catch (err) {
    console.warn(`[Redis safeSet Warning for ${key}]:`, err);
    return false;
  }
}

export async function redisSafeDel(key: string): Promise<boolean> {
  try {
    await redisClient.del(key);
    return true;
  } catch (err) {
    console.warn(`[Redis safeDel Warning for ${key}]:`, err);
    return false;
  }
}
