import { GearApi, CreateType } from '.';
import { GearType, Metadata } from './interfaces';
import { SendMessageError, TransactionError } from './errors';
import { ApiPromise } from '@polkadot/api';
import { Bytes } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';
import { AnyNumber } from '@polkadot/types/types';
import { KeyringPair } from '@polkadot/keyring/types';

export class GearMessage {
  private api: ApiPromise;
  private createType: CreateType;
  submitted: any;

  constructor(gearApi: GearApi) {
    this.api = gearApi.api;
    this.createType = new CreateType(gearApi);
  }

  submit(
    message: { destination: string | H256; payload: string | GearType; gasLimit: AnyNumber; value: AnyNumber },
    meta: Metadata
  ): any {
    let payload: Bytes | Uint8Array | string;

    payload = this.createType.encode(meta.input, message.payload, meta);

    try {
      this.submitted = this.api.tx.gear.sendMessage(message.destination, payload, message.gasLimit, message.value);
      return this.submitted;
    } catch (error) {
      throw new SendMessageError();
    }
  }

  signAndSend(keyring: KeyringPair, callback?: (data: any) => void): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let blockHash: string;
        await this.submitted.signAndSend(keyring, ({ events = [], status }) => {
          if (status.isInBlock) {
            blockHash = status.asInBlock.toHex();
          } else if (status.isFinalized) {
            blockHash = status.asFinalized.toHex();
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
