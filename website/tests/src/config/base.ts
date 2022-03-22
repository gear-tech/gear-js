import assert from 'assert';

function checkEnv(name: string): string {
  const env = process.env[name];
  assert.notStrictEqual(env, undefined, `API_ADDRESS not found`);
  return env as string;
}

export default {
  gear: {
    wsProvider: process.env.WS_PROVIDER || 'ws://localhost:9944',
    api: checkEnv('API_ADDRESS'),
  },
};
