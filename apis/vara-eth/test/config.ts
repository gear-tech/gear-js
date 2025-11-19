import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const assertEnv = (name: string, _default?: string) => {
  const env = process.env[name] || _default;
  if (!env) {
    throw new Error(`Environment variable ${name} is not set`);
  }

  return env;
};

const blockTime = parseInt(process.env.BLOCK_TIME || '12');

export const config = {
  privateKey: assertEnv(
    'CLIENT_PRIVATE_KEY',
    '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
  ).toLowerCase() as `0x${string}`,
  accountAddress: assertEnv('CLIENT_ADDRESS', '0x70997970C51812dc3A010C7d01b50e0d17dc79C8') as `0x${string}`,
  wvaraPrefundedPrivateKey: assertEnv(
    'WVARA_PREFUNDED_PRIVATE_KEY',
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  ).toLowerCase() as `0x${string}`,
  codeId: assertEnv('CODE_ID').toLowerCase() as `0x${string}`,
  routerId: assertEnv('ROUTER_ADDRESS').toLowerCase() as `0x${string}`,
  skipUpload: process.env.SKIP_UPLOAD === 'true',
  blockTime,
  targetDir: path.resolve('target/wasm32-gear/release'),
  solOut: path.resolve('out'),
  wsRpc: assertEnv('WS_RPC'),
  longRunningTestTimeout: blockTime * 20_000,
};
