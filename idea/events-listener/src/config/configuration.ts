import dotenv from 'dotenv';
import { strict as assert } from 'assert';
dotenv.config();

const checkEnv = (envName: string): string => {
  const env = process.env[envName];
  assert.notStrictEqual(env, undefined, `${envName} is not specified`);
  return env as string;
};

export default {
  kafka: {
    clientId: checkEnv('KAFKA_CLIENT_ID'),
    brokers: checkEnv('KAFKA_BROKERS').split(','),
    sasl: {
      username: checkEnv('KAFKA_SASL_USERNAME'),
      password: checkEnv('KAFKA_SASL_PASSWORD'),
    },
  },
  api: {
    provider: process.env.WS_PROVIDER,
  },
  healthcheck: {
    port: Number(process.env.PORT || '3002'),
  },
};
