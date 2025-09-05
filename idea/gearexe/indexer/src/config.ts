import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key: string, _default?: string): string => {
  const value = process.env[key] || _default;
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

export const config = {
  archiveUrl: getEnv('ARCHIVE_URL', 'https://v2.archive.subsquid.io/network/hoodi'),
  rpcUrl: getEnv('RPC_URL'),
  rateLimit: Number(getEnv('RPC_RATE_LIMIT', '20')),
  fromBlock: Number(getEnv('FROM_BLOCK', '0')),
  apiPath: getEnv('API_PATH', './assets'),
  routerAddr: getEnv('ROUTER_ADDR', '0x0000000000000000000000000000000000000000'),
};
