import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || 'https://profound-basilisk-177105.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || 'gQAAAAAAArPRAAIgcDEyNGQ5YWY1YmFjNWI0ZGVlYTYyMTUwY2JjYTE2ODJmOQ',
});
