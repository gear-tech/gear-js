import { GearKeyring } from "@gear-js/api";
import { KeyringPair } from "@polkadot/keyring/types";

import "dotenv/config";

// eslint-disable-next-line consistent-return
export async function getAccount(account: string): Promise<KeyringPair> {
  if (account === "alice") {
    return GearKeyring.fromSuri(process.env.GEAR_ACCOUNT_AL);
  }

  if (account === "bob") {
    return GearKeyring.fromSuri(process.env.GEAR_ACCOUNT_BB);
  }
}
