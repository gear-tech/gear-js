import dotenv from 'dotenv';
import { strict as assert } from 'assert';
dotenv.config();

const checkEnv = (env) => {
  assert.notStrictEqual(env, undefined);
  return env;
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
