import { strict as assert } from 'node:assert';
import dotenv from 'dotenv';

dotenv.config();

export const getEnv = (envName: string, defaultValue?: string) => {
  const env = process.env[envName];
  if (!env && defaultValue) {
    return defaultValue;
  }
  assert.notStrictEqual(env, undefined, `${envName} is not specified`);
  return env as string;
};

export const config = {
  squid: {
    gateway: process.env.ARCHIVE_GATEWAY || '',
    rpc: process.env.RPC_ENDPOINT || '',
    rate: Number.parseInt(getEnv('RATE_LIMIT', '10'), 10),
    fromBlock: Number.parseInt(getEnv('FROM_BLOCK', '0'), 10),
    toBlock: Number.parseInt(getEnv('TO_BLOCK', '0'), 10) || undefined,
  },
  redis: {
    host: getEnv('REDIS_HOST', '127.0.0.1'),
    port: Number.parseInt(getEnv('REDIS_PORT', '6379'), 10),
    user: process.env.REDIS_USER || '',
    password: process.env.REDIS_PASSWORD || '',
  },
};
