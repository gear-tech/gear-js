import { config } from 'dotenv';
import { strict as assert } from 'assert';

config();

export const getEnv = (envName: string, defaultValue?: string) => {
  const env = process.env[envName];
  if (!env && defaultValue) {
    return defaultValue;
  }
  assert.notStrictEqual(env, undefined, `${envName} is not specified`);
  return env as string;
};

export default {
  db: {
    host: getEnv('DB_HOST', 'localhost'),
    port: parseInt(getEnv('DB_PORT', '5432'), 10),
    user: getEnv('DB_USER', 'postgres'),
    password: getEnv('DB_PASSWORD', 'postgres'),
    name: getEnv('DB_NAME', 'meta'),
  },
  server: {
    port: getEnv('SERVER_PORT', '3000'),
  },
};
