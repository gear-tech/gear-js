import * as dotenv from 'dotenv';

dotenv.config();

const getEnv = (key: string, default_?: string): string => {
  const env = process.env[key] || default_;

  if (env === undefined) {
    throw new Error(`Missing environment variable ${key}`);
  }

  return env;
};

export const config = {
  spec: process.env.SPEC_PATH,
  redis: {
    user: getEnv('REDIS_USER', ''),
    password: getEnv('REDIS_PASSWORD', ''),
    host: getEnv('REDIS_HOST'),
    port: getEnv('REDIS_PORT'),
  },
};
