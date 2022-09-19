import assert from 'assert';
import { config } from 'dotenv';
config();

function checkEnv(name: string): string {
  const env = process.env[name];
  assert.notStrictEqual(env, undefined, `${name} is not specified`);
  return env as string;
}

export default {
  gear: {
    // wsProvider: checkEnv('WS_PROVIDER'),
    api: checkEnv('API_ENDPOINT'),
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
};
