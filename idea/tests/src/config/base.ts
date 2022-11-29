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
    wsProviderVara: process.env.WS_PROVIDER_VARA,
    api: checkEnv('API_ENDPOINT'),
  },
};
