import { config } from 'dotenv';
import { strict as assert } from 'assert';

config();

export const checkEnv = (envName: string, defaultValue?: string) => {
  console.log(envName);
  const env = process.env[envName];
  if (!env && defaultValue) {
    return defaultValue;
  }
  assert.notStrictEqual(env, undefined, `${envName} is not specified`);
  return env as string;
};

export default {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: checkEnv('DB_USER'),
    password: checkEnv('DB_PASSWORD'),
    name: checkEnv('DB_NAME'),
  },
  rabbitmq: {
    url: checkEnv('RABBIT_MQ_URL'),
  },
  healthcheck: {
    port: Number(process.env.HEALTHCHECK_PORT || '3001'),
  },
  gear: {
    providerAddresses: checkEnv('WS_PROVIDERS').split(','),
  },
  indexer: {
    batchSize: Number(process.env.BATCH_SIZE || -1),
    logEveryBlock: !!process.env.LOG_EVERY_BLOCK,
  },
};
