import { config } from 'dotenv';
import { strict as assert } from 'assert';
config();

const checkEnv = (env: string) => {
  assert.notStrictEqual(env, undefined);
  return env;
};

export default {
  kafka: {
    clientId: checkEnv(process.env.KAFKA_CLIENT_ID),
    groupId: checkEnv(process.env.KAFKA_GROUP_ID),
    brokers: checkEnv(process.env.KAFKA_BROKERS).split(','),
    sasl: {
      username: checkEnv(process.env.KAFKA_SASL_USERNAME),
      password: checkEnv(process.env.KAFKA_SASL_PASSWORD),
    },
  },
  db: {
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: checkEnv(process.env.DB_USER),
    password: checkEnv(process.env.DB_PASSWORD),
    name: checkEnv(process.env.DB_NAME),
    host: process.env.DB_HOST || 'localhost',
  },
  gear: {
    providerAddress: checkEnv(process.env.WS_PROVIDER),
    accountSeed: checkEnv(process.env.TEST_ACCOUNT_SEED),
    rootAccountSeed: checkEnv(process.env.ROOT_ACCOUNT_SEED),
    accountBalance: checkEnv(process.env.TEST_ACCOUNT_BALANCE),
    balanceToTransfer: checkEnv(process.env.TEST_BALANCE_VALUE),
  },
  healthcheck: {
    port: parseInt(process.env.PORT || '3000'),
  },
};
