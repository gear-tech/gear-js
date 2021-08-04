import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import {
  GearNodeError,
  InvalidParamsError,
  TransactionError,
} from 'src/json-rpc/errors';
import { getNextBlock, valueToString } from './utils';
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
  let message: any;
  try {
    message = await api.tx.gear.sendMessage(
      destination,
      payload,
      gasLimit,
      value,
    );
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
        messageResponse(api, blockHash, destination, callback);
      } else if (status.isInvalid) {
        throw new TransactionError();
      }

      // Check transaction errors
      events
        .filter(({ event }) => api.events.system.ExtrinsicFailed.is(event))
        .forEach(({ event: { data } }) => {
          throw new TransactionError();
        });
    });
  } catch (error) {
    throw new GearNodeError();
  }
}

async function messageResponse(
  api: ApiPromise,
  blockHash: string,
  destination: string,
  callback,
) {
  const nextBlockHash = await getNextBlock(api, blockHash);
  let events: any;
  try {
    events = await api.query.system.events.at(nextBlockHash);
  } catch (error) {
    logger.error(error.message);
    callback('error', new GearNodeError().toJson());
    return null;
  }

  try {
    events
      .filter(({ event }) => api.events.gear.Log.is(event))
      .forEach(({ event: { data } }) => {
        if (data[0].toString() === destination) {
          callback('gear', {
            status: 'Log',
            blockHash: nextBlockHash,
            data: valueToString(data[1]),
          });
        }
      });
  } catch (error) {
    logger.error(error.message);
    callback('error', new GearNodeError().toJson());
    return null;
  }
}
