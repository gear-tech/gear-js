import { GearKeyring } from "@gear-js/api";
import { KeyringPair } from "@polkadot/keyring/types";

import "dotenv/config";
import assert from "assert";

export async function getAccount(account: string): Promise<KeyringPair> {
  if (account === "alice") {
    return GearKeyring.fromSuri("//Alice");
  }

  if (account === "bob") {
    return GearKeyring.fromSuri("//Bob");
  }

  const seed = process.env[account.toUpperCase()] as string;

  if (!seed) {
    assert.notStrictEqual(seed, undefined, `Unable to find ${account} seed in environment variables`);
  }

  return GearKeyring.fromSeed(seed);
}
