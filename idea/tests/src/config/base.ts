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
    wsProvider: checkEnv('WS_PROVIDER'),
    api: checkEnv('API_ENDPOINT'),
  },
};

export const PATH_TO_PROGRAMS = './wasm-test';
