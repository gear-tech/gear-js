import { strict as assert } from 'assert';
import { config } from 'dotenv';
config();

const checkEnv = (env: string) => {
  assert.notStrictEqual(env, undefined, `${env} is not specified`);
  return env;
};

export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
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
