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

const blockTime = parseInt(process.env.BLOCK_TIME || '1');

export const config = {
  codeId: assertEnv('CODE_ID').toLowerCase() as `0x${string}`,
  routerId: assertEnv('ROUTER_ADDRESS').toLowerCase() as `0x${string}`,
  skipUpload: process.env.SKIP_UPLOAD === 'true',
  blockTime,
  targetDir: path.resolve('target/wasm32-gear/release'),
  solOut: path.resolve('out'),
  wsRpc: 'ws://127.0.0.1:8545',
  longRunningTestTimeout: blockTime * 20_000,
  privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as const,
};
