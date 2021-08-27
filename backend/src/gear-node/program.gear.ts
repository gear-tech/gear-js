import { ApiPromise } from '@polkadot/api';
import { Bytes } from '@polkadot/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { InvalidParamsError, TransactionError } from 'src/json-rpc/errors';
import { Logger } from '@nestjs/common';
import { LogMessage } from 'src/messages/interface';
import { RpcCallback } from 'src/json-rpc/interfaces';

const logger = new Logger('Program Upload');

export async function submitProgram(
  api: ApiPromise,
  keyring: KeyringPair,
  code: Bytes,
  salt: string,
  initPayload: Bytes | string,
  gasLimit: number,
  value: number,
  programData: any,
  initMessage: LogMessage,
  callback: RpcCallback,
) {
  return new Promise(async (resolve, reject) => {
    let program: any;
    let saved = false;

    try {
      program = api.tx.gear.submitProgram(
        code,
        salt,
        initPayload,
        gasLimit,
        value,
      );
    } catch (error) {
      logger.error(error);
      reject(new InvalidParamsError(error.message));
      return;
    }

    try {
      await program.signAndSend(keyring, ({ events, status }) => {
        if (status.isInBlock) {
          programData.blockHash = status.asInBlock.toHex();
          programData.uploadedAt = new Date();
        } else if (status.isFinalized) {
          programData.blockHash = status.asFinalized.toHex();
        }

        // Check transaction errors
        events
          .filter(
            ({ event }) =>
              api.events.system.ExtrinsicFailed.is(event)
          )
          .forEach(
            ({
              event: {
                data: [error],
              },
            }) => {
              callback('remove');
              if (error.isModule) {
                const decoded = api.registry.findMetaError(error.asModule);
                const { documentation, method, section } = decoded;
                logger.error(`${documentation.join(' ')}`);
                reject(new TransactionError(`${documentation.join(' ')}`));
              } else {
                logger.error(`${error.toString()}`);
                reject(new TransactionError(`${error.toString()}`));
              }
            },
          );

        events
          .filter(({ event }) => api.events.gear.InitMessageEnqueued.is(event))
          .forEach(async ({ event: { data } }) => {
            programData.hash = data[0].program_id.toHex();
            initMessage.id = data[0].message_id.toHex();
            if (!saved) {
              callback('save');
              saved = true;
            }
            callback('gear', {
              status: status.type,
              blockHash: programData.blockHash,
              programHash: programData.hash,
            });
          });
      });
    } catch (error) {
      logger.error(error);
      const errorCode = +error.message.split(':')[0];
      if (errorCode === 1010) {
        reject(new TransactionError('Account balance too low'));
      } else {
        reject(new TransactionError(error.message));
      }
    }
  });
}
