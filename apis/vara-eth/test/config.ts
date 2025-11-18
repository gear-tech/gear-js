import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const assertEnv = (name: string) => {
  if (!process.env[name]) {
    throw new Error(`Environment variable ${name} is not set`);
  }

  return process.env[name];
};

const blockTime = parseInt(process.env.BLOCK_TIME || '12');

export const config = {
  privateKey: assertEnv('PRIVATE_KEY').toLowerCase() as `0x${string}`,
  codeId: assertEnv('CODE_ID').toLowerCase() as `0x${string}`,
  routerId: assertEnv('ROUTER_ADDRESS').toLowerCase() as `0x${string}`,
  skipUpload: process.env.SKIP_UPLOAD === 'true',
  blockTime,
  targetDir: path.resolve('target/wasm32-gear/release'),
  solOut: path.resolve('out'),
  wsRpc: assertEnv('WS_RPC'),
  longRunningTestTimeout: blockTime * 20_000,
};
