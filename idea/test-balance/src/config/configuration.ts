import { config } from 'dotenv';
import { strict as assert } from 'assert';
config();

const checkEnv = (envName: string) => {
  const env = process.env[envName];
  assert.notStrictEqual(env, undefined, `${envName} is not specified`);
  return env;
};

export default {
  db: {
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: checkEnv('DB_USER'),
    password: checkEnv('DB_PASSWORD'),
    name: checkEnv('DB_NAME'),
    host: process.env.DB_HOST || 'localhost',
  },
  gear: {
    providerAddress: checkEnv('WS_PROVIDER'),
    accountSeed: checkEnv('TEST_ACCOUNT_SEED'),
    rootAccountSeed: checkEnv('ROOT_ACCOUNT_SEED'),
    accountBalance: checkEnv('TEST_ACCOUNT_BALANCE'),
    balanceToTransfer: checkEnv('TEST_BALANCE_VALUE'),
  },
  rabbitmq: {
    url: checkEnv('RABBIT_MQ_URL'),
  },
  // every 10 second "*/10 * * * * *"
  scheduler: {
    checkRabbitMQConnectionTime: process.env.CRON_TIME_CHECK_RABBITMQ_CONNECTION || '*/10 * * * * *',
  },
  healthcheck: {
    port: parseInt(process.env.PORT || '3010'),
  },
};
