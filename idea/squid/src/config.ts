import dotenv from 'dotenv';

dotenv.config();

export const config = {
  squid: {
    gateway: process.env.ARCHIVE_GATEWAY,
    rpc: process.env.RPC_ENDPOINT,
    rate: parseInt(process.env.RATE_LIMIT || '10'),
    fromBlock: parseInt(process.env.FROM_BLOCK || '0'),
    toBlock: parseInt(process.env.TO_BLOCK) || undefined,
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    user: process.env.REDIS_USER || '',
    password: process.env.REDIS_PASSWORD || '',
  },
};
