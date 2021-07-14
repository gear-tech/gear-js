import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { hexToString, isHex, isU8a, u8aToHex } from '@polkadot/util';
import {
  GearNodeError,
  InvalidParamsError,
  TransactionError,
} from 'src/json-rpc/errors';
import { getNextBlock, toHex, valueToString } from './utils';

export async function sendMessage(
  api: ApiPromise,
  keyring: KeyringPair,
  destination: string,
  payload: string,
  gasLimit: number,
  value: number,
  callback,
) {
  payload = toHex(payload);
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

      events.forEach(({ event: { data, section, method } }) => {
        if (section === 'system' && method === 'ExtrinsicFailed') {
          throw new TransactionError();
        }
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
  let res: any;
  try {
    res = await api.query.system.events.at(nextBlockHash);
  } catch (error) {
    console.error(error.message);
    callback('error', new GearNodeError().toJson());
    return null;
  }

  try {
    res.forEach(({ event: { data, method, section } }) => {
      if (section === 'gear') {
        if (method === 'Log') {
          if (data[0].toString() === destination) {
            callback('gear', {
              status: 'Log',
              blockHash: nextBlockHash,
              data: valueToString(data[1]),
            });
          }
        }
      } else if (section === 'system' && method === 'ExtrinsicSuccess') {
        const dataJSON = data[0].toJSON();
        if (dataJSON['class'] && dataJSON['class'] === 'Normal') {
          callback('gear', {
            status: 'Success',
            blockHash: nextBlockHash,
          });
        }
      }
    });
  } catch (error) {
    console.error(error.message);
    callback('error', new GearNodeError().toJson());
    return null;
  }
}
