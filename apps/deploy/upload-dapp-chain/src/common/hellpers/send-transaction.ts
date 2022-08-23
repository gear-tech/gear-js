import { KeyringPair } from "@polkadot/keyring/types";
import { GearApi } from "@gear-js/api";

export async function sendTransaction(
  gearApi: GearApi,
  account: KeyringPair,
  methodName: string,
): Promise<any> {
  return new Promise((resolve, reject) => {
    gearApi.program.signAndSend(account, ({ events, status }) => {
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
