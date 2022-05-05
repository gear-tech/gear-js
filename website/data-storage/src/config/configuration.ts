import { strict as assert } from 'assert';
import { config } from 'dotenv';
config();

const checkEnv = (envName: string) => {
  const env = process.env[envName];
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
  kafka: {
    clientId: checkEnv('KAFKA_CLIENT_ID'),
    groupId: checkEnv('KAFKA_GROUP_ID'),
    brokers: checkEnv('KAFKA_BROKERS').split(','),
    sasl: {
      username: checkEnv('KAFKA_SASL_USERNAME'),
      password: checkEnv('KAFKA_SASL_PASSWORD'),
    },
  },
  healthcheck: {
    port: parseInt(process.env.HEALTHCHECK_PORT || '3000', 10),
  },
});

export const PAGINATION_LIMIT = 20;
