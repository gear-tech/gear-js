import { config } from 'dotenv';
import { strict as assert } from 'assert';

config();

export const checkEnv = (envName: string, defaultValue?: string) => {
  const env = process.env[envName];
  if (!env && defaultValue) {
    return defaultValue;
  }
  assert.notStrictEqual(env, undefined, `${envName} is not specified`);
  return env as string;
};

export default () => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: checkEnv('DB_USER'),
    password: checkEnv('DB_PASSWORD'),
    name: checkEnv('DB_NAME'),
  },
  rabbitmq: {
    url: checkEnv('RABBIT_MQ_URL')
  },
  scheduler: {
    checkRabbitMQConnectionTime: process.env.CRON_TIME_CHECK_RABBITMQ_CONNECTION || '*/10 * * * * *',
  },
  healthcheck: {
    port: Number(process.env.HEALTHCHECK_PORT || '3001'),
  },
  gear: {
    wsProvider: checkEnv('GEAR_WS_PROVIDER', 'ws://127.0.0.1:9944'),
  },
});
