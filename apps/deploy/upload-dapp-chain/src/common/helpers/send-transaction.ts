import { KeyringPair } from "@polkadot/keyring/types";

export async function sendTransaction(
  extrinsic: any,
  account: KeyringPair,
  methodName: string,
): Promise<any> {
  return new Promise((resolve, reject) => {
    extrinsic.signAndSend(account, ({ events, status }) => {
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
