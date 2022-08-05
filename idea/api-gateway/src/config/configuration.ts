import { strict as assert } from 'assert';
import { config } from 'dotenv';
config();

const checkEnv = (envName: string) => {
  const env = process.env[envName];
  assert.notStrictEqual(env, undefined, `${envName} is not specified`);
  return env;
};

export default () => ({
  server: {
    port: parseInt('PORT', 10) || 3000,
    captchaSecret: checkEnv('CAPTCH_SECRET'),
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
  // every 1 hour "0 * * * *"
  cron: {
    time: checkEnv('CRON_TIME') || '0 * * * *',
  }
});
