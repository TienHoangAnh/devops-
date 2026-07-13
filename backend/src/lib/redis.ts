import Redis from 'ioredis';
import { config } from '../config/index.js';

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (!config.redisUrl) return null;
  if (!redis) {
    try {
      redis = new Redis(config.redisUrl, {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });
    } catch {
      return null;
    }
  }
  return redis;
}

export async function cacheGet(key: string): Promise<string | null> {
  const client = getRedis();
  if (!client) return null;
  try {
    return await client.get(key);
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: string, ttlSeconds = 3600): Promise<void> {
  const client = getRedis();
  if (!client) return;
  try {
    await client.setex(key, ttlSeconds, value);
  } catch {
    // ignore cache errors
  }
}

export async function cacheDel(key: string): Promise<void> {
  const client = getRedis();
  if (!client) return;
  try {
    await client.del(key);
  } catch {
    // ignore
  }
}
