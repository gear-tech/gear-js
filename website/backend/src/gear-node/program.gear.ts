import { KeyringPair } from '@polkadot/keyring/types';
import { InvalidParamsError, TransactionError } from 'src/json-rpc/errors';
import { Logger } from '@nestjs/common';
import { RpcCallback } from 'src/json-rpc/interfaces';
import { GearApi } from '@gear-js/api';
import { Metadata } from '@gear-js/api/types';

const logger = new Logger('Program Upload');

export async function sendProgram(
  api: GearApi,
  keyring: KeyringPair,
  code: Buffer,
  initPayload: any,
  gasLimit: number,
  value: number,
  meta: Metadata,
  callback: RpcCallback,
) {
  let programId: any;
  try {
    programId = await api.program.submit(
      { code, gasLimit, value, initPayload },
      meta,
    );
    callback('saveProgram', { programId });
  } catch (error) {
    logger.error(error);
    throw new InvalidParamsError(error.message);
  }

  try {
    await api.program.signAndSend(keyring, (data) => {
      callback('saveMessage', { initMessageId: data.initMessageId });
      callback(undefined, data);
    });
  } catch (error) {
    logger.error(error);
    throw new TransactionError(error.message);
  }
}
