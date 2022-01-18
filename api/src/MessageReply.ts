import { GearApi, CreateType, createPayload } from '.';
import { Metadata } from './interfaces';
import { SendReplyError, TransactionError } from './errors';
import { u64 } from '@polkadot/types';
import { AnyNumber } from '@polkadot/types/types';
import { H256, BalanceOf } from '@polkadot/types/interfaces';
import { KeyringPair } from '@polkadot/keyring/types';

export class GearMessageReply {
  private api: GearApi;
  private createType: CreateType;
  reply: any;

  constructor(gearApi: GearApi) {
    this.api = gearApi;
    this.createType = new CreateType(gearApi);
  }

  submitReply(
    message: {
      toId: H256 | string;
      payload: string | any;
      gasLimit: u64 | AnyNumber;
      value?: BalanceOf | AnyNumber;
    },
    meta?: Metadata,
    messageType?: string,
  ) {
    let payload: string = createPayload(this.createType, messageType || meta.async_handle_input, message.payload, meta);

    try {
      this.reply = this.api.tx.gear.sendReply(message.toId, payload, message.gasLimit, message.value);
      return this.reply;
    } catch (error) {
      throw new SendReplyError();
    }
  }

  signAndSend(keyring: KeyringPair, callback?: (data: any) => void): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let blockHash: string;
        await this.reply.signAndSend(keyring, ({ events = [], status }) => {
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
                  data: [error],
                },
              }) => {
                reject(new TransactionError(`${error.toString()}`));
              },
            );

          events
            .filter(({ event }) => this.api.events.gear.DispatchMessageEnqueued.is(event))
            .forEach(({ event: { data, method } }) => {
              callback({
                method,
                status: status.type,
                blockHash,
                messageId: data.toHuman()[0],
              });
            });
        });
      } catch (error) {
        reject(new TransactionError(error.message));
      }
    });
  }
}
