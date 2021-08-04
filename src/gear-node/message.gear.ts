import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import {
  GearNodeError,
  InvalidParamsError,
  TransactionError,
} from 'src/json-rpc/errors';
import { Bytes } from '@polkadot/types';
import { Logger } from '@nestjs/common';

const logger = new Logger('Send Message');

export async function sendMessage(
  api: ApiPromise,
  keyring: KeyringPair,
  destination: string,
  payload: Bytes | string,
  gasLimit: number,
  value: number,
  callback,
) {
  return new Promise(async (resolve, reject) => {
    let message: any;
    try {
      message = await api.tx.gear.sendMessage(
        destination,
        payload,
        gasLimit,
        value,
      );
    } catch (error) {
      reject(new InvalidParamsError());
    }

    try {
      let blockHash: string;
      await message.signAndSend(keyring, ({ events = [], status }) => {
        if (status.isInBlock) {
          blockHash = status.asInBlock.toHex();
        } else if (status.isFinalized) {
          blockHash = status.asFinalized.toHex();
        } else if (status.isInvalid) {
          reject(new TransactionError());
        }

        // Check transaction errors
        events
          .filter(({ event }) => api.events.system.ExtrinsicFailed.is(event))
          .forEach(({ event: { data } }) => {
            reject(new TransactionError());
          });

        events
          .filter(({ event }) => api.events.system.ExtrinsicSuccess.is(event))
          .forEach(({ event: { data } }) => {
            callback({
              status: status.type,
              blockHash: blockHash,
            });
          });
      });
    } catch (error) {
      reject(new GearNodeError(error.message));
    }
  });
}
