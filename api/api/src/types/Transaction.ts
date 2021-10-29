import { AddressOrPair, SignerOptions, SubmittableExtrinsic } from '@polkadot/api/types';
import { CreateType, GearApi, TransactionStatusCb } from '../';
import { isFunction } from '@polkadot/util';
import { TransactionError } from '../errors';
import { MessageInfoData } from '.';

export class GearTransaction {
  protected api: GearApi;
  protected createType: CreateType;
  protected method: string;
  submitted: SubmittableExtrinsic<'promise'>;

  constructor(gearApi: GearApi, method: string) {
    this.api = gearApi;
    this.createType = new CreateType(gearApi);
    this.method = method;
  }

  signAndSend(account: AddressOrPair, callback: TransactionStatusCb): Promise<0>;

  signAndSend(account: AddressOrPair, options: Partial<SignerOptions>): Promise<0>;

  signAndSend(account: AddressOrPair, options: Partial<SignerOptions>, callback: TransactionStatusCb): Promise<0>;

  public signAndSend(
    account: AddressOrPair,
    optionsOrCallback?: Partial<SignerOptions> | TransactionStatusCb,
    optionalCallback?: (data: any) => void
  ): Promise<0> {
    const [options, callback] = isFunction(optionsOrCallback)
      ? [undefined, optionsOrCallback]
      : [optionsOrCallback, optionalCallback];

    return new Promise(async (resolve, reject) => {
      try {
        let blockHash: string;
        await this.submitted.signAndSend(account, options, ({ events = [], status }) => {
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

          events.forEach(({ event: { data, method } }) => {
            if (method === this.method) {
              const eventData = new MessageInfoData(data);
              callback({
                method,
                status: status.type,
                blockHash,
                programId: eventData.programId.toHex(),
                messageId: eventData.messageId.toHex()
              });
            }
          });
        });
      } catch (error) {
        const errorCode = +error.message.split(':')[0];
        if (errorCode === 1010) {
          reject(new TransactionError('Account balance too low'));
        } else {
          reject(new TransactionError(error.message));
        }
      }
    });
  }
}
