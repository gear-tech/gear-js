import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  spec: process.env.SPEC_PATH,
  redis: {
    user: process.env.REDIS_USER ?? '',
    password: process.env.REDIS_PASSWORD ?? '',
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
};
