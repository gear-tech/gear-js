import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const assertEnv = (name: string) => {
  if (!process.env[name]) {
    throw new Error(`Environment variable ${name} is not set`);
  }

  return process.env[name];
};

export const config = {
  privateKey: assertEnv('PRIVATE_KEY').toLowerCase() as `0x${string}`,
  codeId: assertEnv('CODE_ID').toLowerCase(),
  routerId: assertEnv('ROUTER_ADDRESS').toLowerCase(),
  skipUpload: process.env.SKIP_UPLOAD === 'true',
  blockTime: parseInt(process.env.BLOCK_TIME || '12'),
  targetDir: path.resolve('target/wasm32-gear/release'),
  solOut: path.resolve('out'),
};
