import dotenv from 'dotenv';
import type { Address, Hash } from 'viem';

import type { NetworkConfig } from './shared/types.js';

dotenv.config({ quiet: true });

const assertEnv = <T>(envName: string, defaultValue?: string, transformer?: (value: string) => T): T => {
  const value = process.env[envName] || defaultValue;
  if (!value) throw new Error(`Missing environment variable: ${envName}`);
  return transformer ? (transformer(value) as T) : (value as T);
};

function parseNetworks(): NetworkConfig[] {
  const names = assertEnv<string>('NETWORKS')
    .split(',')
    .map((n) => n.trim().toLowerCase())
    .filter(Boolean);

  if (names.length === 0) throw new Error('NETWORKS must contain at least one network name');

  return names.map((name) => {
    const prefix = name.toUpperCase();
    return {
      name,
      routerAddress: assertEnv<Address>(`${prefix}_ROUTER_ADDRESS`),
      ethereumRpcUrl: assertEnv<string>(`${prefix}_ETHEREUM_RPC_URL`),
      privateKey: assertEnv<Hash>(`${prefix}_PRIVATE_KEY`),
    };
  });
}

export const config = {
  networks: parseNetworks(),
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

export const networkConfigMap = new Map<string, NetworkConfig>(config.networks.map((n) => [n.name, n]));
