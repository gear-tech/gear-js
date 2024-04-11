import * as dotenv from 'dotenv';
import assert from 'assert/strict';

dotenv.config();

const getEnv = (name: string, defaultValue: string) => {
  const value = process.env[name] || defaultValue;

  assert.notStrictEqual(value, undefined, `Environment variable ${name} is not set`);

  return value as string;
};

export const config = {
  network: {
    archive: getEnv('SQUID_ARCHIVE', 'vara'),
    rpcEndpoint: getEnv('RPC_ENDPOINT', 'http://localhost:9944'),
    fromBlock: Number(getEnv('FROM_BLOCK', '0')),
  },
  db: {
    host: getEnv('DB_HOST', 'localhost'),
    port: Number(getEnv('DB_PORT', '5432')),
    user: getEnv('DB_USER', 'postgres'),
    password: getEnv('DB_PASS', 'password'),
    database: getEnv('DB_NAME', 'voucher_indexer'),
  },
};
