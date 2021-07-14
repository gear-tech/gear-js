import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import {
  GearNodeError,
  InvalidParamsError,
  ProgramInitializedFailed,
  TransactionError,
} from 'src/json-rpc/errors';
import { getNextBlock, toHex } from './utils';

export async function submitProgram(
  api: ApiPromise,
  keyring: KeyringPair,
  binary: Buffer,
  salt: string,
  initPayload: string,
  gasLimit: number,
  value: number,
  programData: any,
  callback: Function,
) {
  const bytes = api.createType('Bytes', Array.from(binary));
  initPayload = toHex(initPayload);
  let program: any;

  try {
    program = api.tx.gear.submitProgram(
      bytes,
      salt,
      initPayload,
      gasLimit,
      value,
    );
  } catch (error) {
    throw new InvalidParamsError();
  }

  try {
    await program.signAndSend(keyring, ({ events = [], status }) => {
      if (status.isInBlock) {
        programData.blockHash = status.asInBlock.toHex();
        programData.uploadedAt = new Date().toString();
      } else if (status.isFinalized) {
        programData.blockHash = status.asFinalized.toHex();
      }

      events.forEach(({ event: { data, method, section } }) => {
        if (section === 'gear') {
          if (method === 'NewProgram') {
            programData.hash = data[0].toString();
            callback('gear', {
              status: status.type,
              blockHash: programData.blockHash,
              programHash: programData.hash,
            });
            if (status.type === 'Finalized') {
              programInitInfo(
                api,
                programData.blockHash,
                data[0].toString(),
                callback,
              );
            }
          }
        }
      });
    });
  } catch (error) {
    const errorCode = +error.message.split(':')[0];
    if (errorCode === 1010) {
      throw new TransactionError('Account balance too low');
    } else {
      throw new TransactionError(error.message);
    }
  }
}

async function programInitInfo(
  api: ApiPromise,
  blockHash: string,
  programHash: string,
  callback,
) {
  const nextBlockHash = await getNextBlock(api, blockHash);
  let res: any;
  try {
    res = await api.query.system.events.at(nextBlockHash);
  } catch (error) {
    console.error(error.message);
    callback('error', new ProgramInitializedFailed().toJson());
    return null;
  }

  let initialized = false;
  try {
    res.forEach(({ event: { data, method, section } }) => {
      if (section === 'gear') {
        if (
          method === 'ProgramInitialized' &&
          data[0].toString() === programHash
        ) {
          callback('save');
          initialized = true;
          callback('gear', {
            status: method,
            blockHash: nextBlockHash,
            programHash: data[0].toString(),
          });
        } else if (
          method === 'InitFailure' &&
          data[0].toString() === programHash
        ) {
          throw new ProgramInitializedFailed();
        }
      } else if (section === 'system' && method === 'ExtrinsicSuccess') {
        const dataJSON = data[0].toJSON();
        if (dataJSON['class'] && dataJSON['class'] === 'Normal') {
          if (!initialized) {
            throw new ProgramInitializedFailed();
          }
          callback('gear', {
            status: 'Success',
          });
        }
      }
    });
  } catch (error) {
    if (error instanceof ProgramInitializedFailed) {
      callback('error', error.toJson());
    } else {
      callback('error', new GearNodeError().toJson());
    }
    return null;
  }
}
