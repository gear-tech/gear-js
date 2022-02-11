import { strict as assert } from 'assert';
import { config } from 'dotenv';
config();

const checkEnv = (env: typeof process.env['']) => {
  assert.notStrictEqual(env, undefined);
  return env as string;
};

export default () => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
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
