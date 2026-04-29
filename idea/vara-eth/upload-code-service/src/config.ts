import dotenv from 'dotenv';
import type { Address, Hash } from 'viem';

dotenv.config({ quiet: true });

const assertEnv = <T>(envName: string, defaultValue?: string, transformer?: (value: string) => T) => {
  const value = process.env[envName] || defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${envName}`);
  }
  if (transformer) {
    return transformer(value) as T;
  }

  return value as T;
};

export const config = {
  routerAddress: assertEnv<Address>('ROUTER_ADDRESS'),
  ethereumRpcUrl: assertEnv<string>('ETHEREUM_RPC_URL'),
  privateKey: assertEnv<Hash>('PRIVATE_KEY'),
  db: {
    host: assertEnv<string>('DB_HOST'),
    port: assertEnv<number>('DB_PORT', '5432', Number),
    name: assertEnv<string>('DB_NAME'),
    username: assertEnv<string>('DB_USERNAME'),
    password: assertEnv<string>('DB_PASSWORD'),
  },
  port: assertEnv<number>('PORT', '3000', Number),
  workerConcurrency: assertEnv<number>('WORKER_CONCURRENCY', '3', Number),
};
