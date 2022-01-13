import dotenv from 'dotenv';
import { strict as assert } from 'assert';
dotenv.config();

const checkEnv = (env: typeof process.env['']): string => {
  assert.notStrictEqual(env, undefined);
  return env as string;
};

export default {
  kafka: {
    clientId: checkEnv(process.env.KAFKA_CLIENT_ID),
    brokers: checkEnv(process.env.KAFKA_BROKERS).split(','),
    sasl: {
      username: checkEnv(process.env.KAFKA_SASL_USERNAME),
      password: checkEnv(process.env.KAFKA_SASL_PASSWORD),
    },
  },
  api: {
    provider: process.env.WS_PROVIDER,
  },
};
