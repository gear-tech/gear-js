import { createClient, RedisClientType } from 'redis';
import { logger } from 'gear-idea-common';
import * as crypto from 'node:crypto';

import { config } from '../config';

export let isRedisConnected = false;
let isLoggedRedisError = false;

export let client: RedisClientType;

// TODO: reconnect

export async function redisConnect() {
  client = createClient({
    url: `redis://${config.redis.user}:${config.redis.password}@${config.redis.host}:${config.redis.port}`,
  });

  await client.connect();
  isRedisConnected = true;
  logger.info('Redis connected', { host: config.redis.host, port: config.redis.port });

  client.on('disconnected', (err) => {
    logger.error('Redis disconnected', { error: err.message });
    isRedisConnected = false;
  });

  client.on('error', (err) => {
    if (!isLoggedRedisError) {
      logger.error('Redis Client Error', { error: err.message });
      isLoggedRedisError = true;
    }
    isRedisConnected = false;
  });
}

export function hash(method: string, data: any) {
  return crypto
    .createHash('sha1')
    .update(method + JSON.stringify(data))
    .digest('base64');
}
