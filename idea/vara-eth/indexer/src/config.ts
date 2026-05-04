import dotenv from 'dotenv';
import type { Address } from 'viem';

dotenv.config({ quiet: true, path: ['.env', '../../../.env'] });

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
  routerAddr: getEnv('ROUTER_ADDR') as Address,
};
