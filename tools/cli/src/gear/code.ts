import { CodeChangedData, GearApi, generateCodeHash } from '@gear-js/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { HexString } from '@polkadot/util/types';
import fs from 'fs';

import { ICode, SchemeCode } from '../types';
import { logger } from '../utils';

export async function uploadCode(api: GearApi, account: KeyringPair, pathToProgram: string) {
  const code = fs.readFileSync(pathToProgram);

  const codeHash = generateCodeHash(code);
  logger.info(`Code hash: ${codeHash}`, { lvl: 1 });

  const uploadedCode = await api.code.storage(codeHash);

  if (uploadedCode.isSome) {
    logger.warn(`Code is already uploaded`, { lvl: 1 });
    return { codeHash };
  }

  await api.code.upload(code);

  const blockHash: HexString = await new Promise((resolve, reject) =>
    api.code.signAndSend(account, ({ events, status }) => {
      const ccEvent = events.find(({ event }) => event.method === 'CodeChanged');
      const data = ccEvent?.event.data as CodeChangedData;
      if (status.isInBlock) {
        if (data.change.isActive) {
          resolve(status.asInBlock.toHex());
        } else {
          reject(JSON.stringify(data.change.toHuman()));
        }
      }
    }),
  );

  logger.info('Code successfully uploaded', { lvl: 1 });

  return { codeHash, blockHash };
}

export function getCodes(codes: Array<SchemeCode>): Record<number, ICode> {
  const result: Record<number, ICode> = {};

  codes.forEach(({ id, ...rest }) => {
    result[id] = rest;
  });

  return result;
}
