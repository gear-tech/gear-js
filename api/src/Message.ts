import { GearApi, CreateType } from '.';
import { Message } from './interfaces';
import { SendMessageError, TransactionError } from './errors';
import { ApiPromise } from '@polkadot/api';
import { Bytes } from '@polkadot/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { Metadata } from './interfaces/metadata';

export class GearMessage {
  private api: ApiPromise;
  private createType: CreateType;
  message: any;

  constructor(gearApi: GearApi) {
    this.api = gearApi.api;
    this.createType = new CreateType(gearApi);
  }

  async submit(message: Message, meta: Metadata) {
    let payload: Bytes | Uint8Array | string;

    payload = this.createType.encode(meta.input, message.payload, meta);

    try {
      this.message = this.api.tx.gear.sendMessage(message.destination, payload, message.gasLimit, message.value);
      return this.message;
    } catch (error) {
      throw new SendMessageError();
    }
  }

  signAndSend(keyring: KeyringPair, callback?: (data: any) => void): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let blockHash: string;
        await this.message.signAndSend(keyring, ({ events = [], status }) => {
          if (status.isInBlock) {
            blockHash = status.asInBlock.toHex();
            resolve(0);
          } else if (status.isInvalid) {
            reject(new TransactionError(`Transaction error. Status: isInvalid`));
          }

          // Check transaction errors
          events
            .filter(({ event }) => this.api.events.system.ExtrinsicFailed.is(event))
            .forEach(
              ({
                event: {
                  data: [error]
                }
              }) => {
                reject(new TransactionError(`${error.toString()}`));
              }
            );

          events
            .filter(({ event }) => this.api.events.gear.DispatchMessageEnqueued.is(event))
            .forEach(({ event: { data, method } }) => {
              callback({
                method,
                status: status.type,
                blockHash,
                messageId: data.toHuman()[0]
              });
            });
        });
      } catch (error) {
        reject(new TransactionError(error.message));
      }
    });
  }
}
