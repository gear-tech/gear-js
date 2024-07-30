import dotenv from 'dotenv';

dotenv.config();

export const config = {
  squid: {
    gateway: process.env.ARCHIVE_GATEWAY,
    rpc: process.env.RPC_ENDPOINT,
    rate: parseInt(process.env.RATE_LIMIT || '10'),
  },
};
