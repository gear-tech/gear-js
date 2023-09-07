import { strict as assert } from 'assert';
import { config } from 'dotenv';
config();

const checkEnv = (envName: string, default_?: string) => {
  const env = process.env[envName] || default_;
  assert.notStrictEqual(env, undefined, `${envName} is not specified`);
  return env;
};

export default {
  server: {
    port: parseInt('PORT', 10) || 3000,
    captchaSecret: checkEnv('CAPTCH_SECRET'),
  },
  rabbitmq: {
    url: checkEnv('RABBIT_MQ_URL'),
  },
  // every 1 hour "0 * * * *"
  // every 10 second "*/10 * * * * *"
  scheduler: {
    genesisHashesTime: process.env.CRON_TIME_GENESIS_HASHES || '0 * * * *',
  },
  redis: {
    host: checkEnv('REDIS_HOST', '127.0.0.1'),
    port: Number(checkEnv('REDIS_PORT', '6379')),
  },
};
