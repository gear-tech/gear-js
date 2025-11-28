import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ quiet: true, path: ['scripts/anvil.env'] });

export const assertEnv = (name: string, _default?: string) => {
  const env = process.env[name] || _default;
  if (!env) {
    throw new Error(`Environment variable ${name} is not set`);
  }

  return env;
};

const blockTime = parseInt(process.env.BLOCK_TIME || '12');

export const config = {
  codeId: assertEnv('CODE_ID').toLowerCase() as `0x${string}`,
  routerId: assertEnv('ROUTER_ADDRESS').toLowerCase() as `0x${string}`,
  skipUpload: process.env.SKIP_UPLOAD === 'true',
  blockTime,
  targetDir: path.resolve('target/wasm32-gear/release'),
  solOut: path.resolve('out'),
  wsRpc: assertEnv('ETHEREUM_WS_RPC'),
  longRunningTestTimeout: blockTime * 20_000,
  privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d' as const,
};
