import assert from 'assert';
import { config } from 'dotenv';
config();

function assertEnv(envName: string): string {
  const env = process.env[envName];
  assert.notStrictEqual(env, undefined, `${envName} is unspecified`);
  return env as string;
}

export default {
  marketplace: {
    id: assertEnv('MARKETPLACE_ID'), //'0x8af88fb83e25f30f4b46b3c8c9666def3162218edbd1571180dc6451a8bfaef3',
    meta: assertEnv('MARKETPLACE_META'),
  },
  nft: {
    meta: assertEnv('NFT_META'),
  },
  squid: {
    archiveUrl: assertEnv('ARCHIVE_URL'), //'http://mithriy.com:8888/graphql',
    startBlock: Number(assertEnv('FROM_BLOCK')),
  },
};
