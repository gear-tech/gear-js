import { KeyringPair } from '@polkadot/keyring/types';
import { InvalidParamsError, TransactionError } from 'src/json-rpc/errors';
import { Bytes } from '@polkadot/types';
import { Logger } from '@nestjs/common';
import { RpcCallback } from 'src/json-rpc/interfaces';
import { GearApi } from '@gear-js/api';
import { Metadata } from '@gear-js/api/types';

const logger = new Logger('Send Message');

export async function sendMessage(
  api: GearApi,
  keyring: KeyringPair,
  destination: string,
  payload: Bytes | string,
  gasLimit: number,
  value: number,
  meta: Metadata,
  callback: RpcCallback,
): Promise<void> {
  let message: any;
  try {
    message = api.message.submit(
      { destination, payload, gasLimit, value },
      meta,
    );
  } catch (error) {
    throw new InvalidParamsError();
  }

  try {
    await api.message.signAndSend(keyring, (data) => {
      callback('save', data);
    });
  } catch (error) {
    throw new TransactionError(error.message);
  }
}
