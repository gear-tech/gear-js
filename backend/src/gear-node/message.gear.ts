import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import {
  GearNodeError,
  InvalidParamsError,
  TransactionError,
} from 'src/json-rpc/errors';
import { Bytes } from '@polkadot/types';
import { Logger } from '@nestjs/common';
import { LogMessage } from 'src/messages/interface';
import { RpcCallback } from 'src/json-rpc/interfaces';

const logger = new Logger('Send Message');

export async function sendMessage(
  api: ApiPromise,
  keyring: KeyringPair,
  destination: string,
  payload: Bytes | string,
  gasLimit: number,
  value: number,
  initMessage: LogMessage,
  callback: RpcCallback,
): Promise<void> {
  let message: any;
  try {
    message = api.tx.gear.sendMessage(destination, payload, gasLimit, value);
  } catch (error) {
    throw new InvalidParamsError();
  }

  try {
    let blockHash: string;
    await message.signAndSend(keyring, ({ events = [], status }) => {
      if (status.isInBlock) {
        blockHash = status.asInBlock.toHex();
      } else if (status.isFinalized) {
        blockHash = status.asFinalized.toHex();
      } else if (status.isInvalid) {
        throw new TransactionError();
      }

      // Check transaction errors
      events
        .filter(({ event }) => api.events.system.ExtrinsicFailed.is(event))
        .forEach(({ event: { data } }) => {
          throw new TransactionError();
        });

      events
        .filter(({ event }) =>
          api.events.gear.DispatchMessageEnqueued.is(event),
        )
        .forEach(({ event: { data } }) => {
          initMessage.id = data.toHuman()[0];
          initMessage.date = new Date();
          callback('save');
          callback('gear', {
            status: status.type,
            messageId: data.toHuman()[0],
            blockHash: blockHash,
          });
        });
    });
  } catch (error) {
    throw new GearNodeError(error.message);
  }
}
