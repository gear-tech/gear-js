import * as crypto from 'node:crypto';
import { createClient, type RedisClientType } from 'redis';

import { logger } from './logger.js';

const INCRBY_IF_EXISTS = `
  if redis.call('exists', KEYS[1]) == 1 then
    return redis.call('incrby', KEYS[1], ARGV[1])
  end
  return nil
`;

export function hash(method: string, data: unknown): string {
  const stable =
    data !== null && typeof data === 'object'
      ? JSON.stringify(data, Object.keys(data as object).sort())
      : JSON.stringify(data);
  return crypto.createHash('sha1').update(method + stable).digest('base64');
}

export class DataCache {
  private readonly _redis: RedisClientType | null;

  constructor(redis: RedisClientType | null) {
    this._redis = redis;
  }

  get connected(): boolean {
    return this._redis !== null;
  }

  get client(): RedisClientType {
    return this._redis!;
  }

  static async connect(cfg: {
    user: string;
    password: string;
    host?: string;
    port?: string | number;
  }): Promise<DataCache> {
    if (!cfg.host) return new DataCache(null);
    const client = createClient({
      username: cfg.user,
      password: cfg.password,
      socket: { host: cfg.host, port: Number(cfg.port) || 6379 },
    }) as RedisClientType;
    try {
      await client.connect();
      return new DataCache(client);
    } catch {
      logger.warn('Redis connection failed, caching disabled');
      return new DataCache(null);
    }
  }

  async get<T>(key: string, fallback: () => Promise<T>, ttl?: number): Promise<T> {
    if (!this._redis) return fallback();

    const cached = await this._redis.get(key);
    if (cached !== null) return JSON.parse(cached as string) as T;

    const result = await fallback();
    if (result != null) this.set(key, result, ttl).catch(() => {});
    return result;
  }

  async getNumber(key: string, fallback: () => Promise<number>): Promise<number> {
    if (!this._redis) return fallback();

    const cached = await this._redis.get(key);
    if (cached !== null) return Number(cached);
    const result = await fallback();
    if (result !== 0) this._redis.set(key, result.toString()).catch(() => {});
    return result;
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    if (!this._redis) return;
    const opts = ttl !== undefined ? { EX: ttl } : undefined;
    await this._redis.set(key, JSON.stringify(value), opts);
  }

  async incrementIfExists(key: string, by = 1): Promise<void> {
    if (!this._redis) return;
    await this._redis.eval(INCRBY_IF_EXISTS, { keys: [key], arguments: [by.toString()] });
  }

  async incrementManyIfExists(entries: [key: string, by: number][]): Promise<void> {
    if (!this._redis || entries.length === 0) return;
    const pipeline = this._redis.multi();
    for (const [key, by] of entries) {
      pipeline.eval(INCRBY_IF_EXISTS, { keys: [key], arguments: [by.toString()] });
    }
    await pipeline.exec();
  }

  async hGetAll(key: string): Promise<Record<string, string>> {
    if (!this._redis) return {};
    return this._redis.hGetAll(key);
  }

  async hSet(key: string, entries: Record<string, string | number>): Promise<void> {
    if (!this._redis) return;
    await this._redis.hSet(key, entries);
  }

  async hDel(key: string, fields: string[]): Promise<void> {
    if (!this._redis || fields.length === 0) return;
    await this._redis.hDel(key, fields);
  }

  async increment(key: string, by = 1): Promise<number> {
    if (!this._redis) return 0;
    return this._redis.incrBy(key, by);
  }

  async getVersioned<T>(dataKey: string, versionKey: string, fallback: () => Promise<T>): Promise<T> {
    if (!this._redis) return fallback();

    const [cached, currentVersion] = await Promise.all([this._redis.get(dataKey), this._redis.get(versionKey)]);

    if (cached !== null) {
      const wrapper = JSON.parse(cached as string) as { v: string; data: T };
      if (wrapper.v === (currentVersion ?? '0')) return wrapper.data;
    }

    const data = await fallback();
    const serialized = JSON.stringify({ v: currentVersion ?? '0', data });
    this._redis.set(dataKey, serialized).catch(() => {});
    return data;
  }

  async invalidate(key: string): Promise<void> {
    if (!this._redis) return;
    await this._redis.del(key);
  }
}
