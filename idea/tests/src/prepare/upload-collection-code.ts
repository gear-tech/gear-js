import { CodeChangedData, GearApi, Hex } from '@gear-js/api';
import { readFileSync } from 'fs';

import { ICodeSpec, IPreparedCollectionCode } from '../interfaces';
import accounts from '../config/accounts';
import { checkCollectionCode } from './check';

async function uploadCode(api: GearApi, spec: ICodeSpec): Promise<{ id: Hex, change: string, expiration: any } | void> {
  const code = readFileSync(spec.pathToOpt);
  const account = (await accounts())[spec.account];
  await api.code.upload(code);

  return new Promise((resolve) => {
    api.code.signAndSend(account, ({ events = [] }) => {
      events.forEach(({ event: { method, data } }) => {
        if (method === 'ExtrinsicFailed') {
          throw new Error(`Unable to send code. ExtrinsicFailed. ${data.toString()}`);
        }

        if (method === 'CodeChanged') {
          const { id, change } = data as CodeChangedData;
          const status = change.isActive ? 'Active' : change.isInactive ? 'Inactive' : null;
          const expiration = change.isActive ? change.asActive.expiration.toHuman() : null;

          resolve({ id: id.toHex(), change: status, expiration });
        }
      });
    });
  });
}


async function uploadCollectionCode(
  api: GearApi,
  collectionCode: { [key: string]: ICodeSpec[] },
):Promise<IPreparedCollectionCode> {
  const sendCollectionCode = new Map<Hex, any>;

  for (const key of  Object.keys(collectionCode)) {
    const listCode = collectionCode[key];

    for (const code of listCode) {
      const sentCode = await uploadCode(api, code);
      if (sentCode) {
        sendCollectionCode.set(sentCode.id, sentCode);
      }
    }
  }

  return checkCollectionCode(sendCollectionCode, collectionCode);
}

export  { uploadCollectionCode };
