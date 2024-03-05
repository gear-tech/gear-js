import { config } from 'dotenv';
import { strict as assert } from 'assert';

config();

export const getEnv = (envName: string, defaultValue?: string) => {
  const env = process.env[envName];
  if (!env && defaultValue) {
    return defaultValue;
  }
  assert.notStrictEqual(env, undefined, `${envName} is not specified`);
  return env as string;
};

export default {
  database: {
    host: getEnv('DB_HOST', '127.0.0.1'),
    port: Number(getEnv('DB_PORT', '5432')),
    user: getEnv('DB_USER'),
    password: getEnv('DB_PASSWORD'),
    name: getEnv('DB_NAME'),
  },
  rabbitmq: {
    url: getEnv('RABBIT_MQ_URL'),
  },
  healthcheck: {
    port: Number(getEnv('HEALTHCHECK_PORT', '3001')),
  },
  gear: {
    providerAddresses: getEnv('GEAR_WS_PROVIDER').split(','),
  },
  indexer: {
    fromBlock: Number(getEnv('FROM_BLOCK', '0')),
    batchSize: Number(getEnv('BATCH_SIZE', '5')),
  },
};
