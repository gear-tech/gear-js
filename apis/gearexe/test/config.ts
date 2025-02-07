import path from 'path';

export const assertEnv = (name: string) => {
  if (!process.env[name]) {
    throw new Error(`Environment variable ${name} is not set`);
  }

  return process.env[name];
};

export const config = {
  privateKey: assertEnv('PRIVATE_KEY').toLowerCase(),
  codeId: assertEnv('CODE_ID').toLowerCase(),
  routerId: assertEnv('ROUTER_ADDRESS').toLowerCase(),
  skipUpload: process.env.SKIP_UPLOAD === 'true',
  blockTime: parseInt(assertEnv('BLOCK_TIME'), 12),
  targetDir: path.resolve('../../target/wasm32-unknown-unknown/release'),
};
