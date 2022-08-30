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
    id: assertEnv('MARKETPLACE_ID'),
    meta: assertEnv('MARKETPLACE_META'),
  },
  nft: {
    meta: assertEnv('NFT_META'),
  },
  squid: {
    archiveUrl: assertEnv('ARCHIVE_URL'),
    startBlock: Number(assertEnv('FROM_BLOCK')),
  },
};
