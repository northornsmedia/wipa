import { Redis } from '@upstash/redis';

let redisClient: Redis | null | undefined;

function getRedisClient(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  redisClient = url && token ? new Redis({ url, token }) : null;
  return redisClient;
}

export const redis = {
  async get<T = unknown>(key: string): Promise<T | null> {
    const client = getRedisClient();
    return client ? client.get<T>(key) : null;
  },
  async set(key: string, value: any, options?: any): Promise<any> {
    const client = getRedisClient();
    return client ? client.set(key, value, options) : null;
  },
  async del(...keys: string[]): Promise<any> {
    const client = getRedisClient();
    return client ? client.del(...keys) : 0;
  },
};

// Structured Redis Cache Keys Schema
export const REDIS_KEYS = {
  profile: (id: string) => `wipa:profile:${id}`,
  searchProfiles: (query: string) => `wipa:search:profiles:${query.toLowerCase().trim()}`,
  globalSearch: (query: string) => `wipa:search:global:v1:${query.toLowerCase().trim()}`,
  feedPosts: 'wipa:feed:posts:v2',
  userChatConversations: (userId: string) => `wipa:chat:conversations:${userId}`,
  userUnreadCount: (userId: string) => `wipa:chat:unread:${userId}`,
  eventList: 'wipa:events:all',
};

// Safe helper functions to guarantee zero crash if Redis is unavailable
export async function redisSafeGet<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get<T>(key);
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
    await redis.set(key, payload, { ex: ttlSeconds });
    return true;
  } catch (err) {
    console.warn(`[Redis safeSet Warning for ${key}]:`, err);
    return false;
  }
}

export async function redisSafeDel(key: string): Promise<boolean> {
  try {
    await redis.del(key);
    return true;
  } catch (err) {
    console.warn(`[Redis safeDel Warning for ${key}]:`, err);
    return false;
  }
}
