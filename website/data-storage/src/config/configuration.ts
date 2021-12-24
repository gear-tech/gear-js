import { strict as assert } from 'assert';

const checkEnv = (env: string) => {
  assert.notStrictEqual(env, undefined);
  return env;
};

export default () => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: checkEnv(process.env.DB_USER),
    password: checkEnv(process.env.DB_PASSWORD),
    name: checkEnv(process.env.DB_NAME),
  },
  kafka: {
    clientId: checkEnv(process.env.KAFKA_CLIENT_ID),
    groupId: checkEnv(process.env.KAFKA_GROUP_ID),
    brokers: checkEnv(process.env.KAFKA_BROKERS).split(','),
    sasl: {
      username: checkEnv(process.env.KAFKA_SASL_USERNAME),
      password: checkEnv(process.env.KAFKA_SASL_PASSWORD),
    },
  },
});

export const PAGINATION_LIMIT = 20;
