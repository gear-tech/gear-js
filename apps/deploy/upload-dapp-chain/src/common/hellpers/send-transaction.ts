import { KeyringPair } from "@polkadot/keyring/types";
import { GearApi } from "@gear-js/api";
import { ApiKey } from "../enums";

export async function sendTransaction(
  gearApi: GearApi,
  account: KeyringPair,
  methodName: string,
  apiKey: ApiKey,
): Promise<any> {
  return new Promise((resolve, reject) => {
    gearApi[apiKey].signAndSend(account, ({ events, status }) => {
      events.forEach(({ event: { method, data } }) => {
        if (method === methodName && status.isFinalized) {
          resolve(data.toHuman());
        } else if (method === "ExtrinsicFailed") {
          reject(data.toString());
        }
      });
    })
      .catch((err) => {
        console.log(err);
        reject(err.message);
      });
  });
}
