import { strict as assert } from 'node:assert';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

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
    gateway: getEnv('ARCHIVE_GATEWAY'),
    rpc: getEnv('RPC_ENDPOINT'),
    rate: Number.parseInt(getEnv('RATE_LIMIT', '10'), 10),
    fromBlock: Number.parseInt(getEnv('FROM_BLOCK', '0'), 10),
    toBlock: Number.parseInt(getEnv('TO_BLOCK', '0'), 10) || undefined,
    apiKey: getEnv('API_KEY'),
  },
  dns: (() => {
    const programAddress = getEnv('DNS_PROGRAM_ADDRESS', '0x').toLowerCase();
    return {
      programAddress,
      enabled: programAddress !== '0x',
    };
  })(),
  redis: {
    host: getEnv('REDIS_HOST', '127.0.0.1'),
    port: Number.parseInt(getEnv('REDIS_PORT', '6379'), 10),
    user: getEnv('REDIS_USER'),
    password: getEnv('REDIS_PASSWORD'),
  },
};
