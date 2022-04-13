import { CreateType } from './create-type';
import { GearApi } from './GearApi';
import { TransactionStatusCb } from './types';
import { isFunction } from '@polkadot/util';
import { AddressOrPair, SignerOptions, SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { Hash } from '@polkadot/types/interfaces';
import { TransactionError } from './errors';

export class GearTransaction {
  protected api: GearApi;
  protected createType: CreateType;
  submitted: SubmittableExtrinsic<'promise', ISubmittableResult>;

  constructor(gearApi: GearApi) {
    this.api = gearApi;
    this.createType = new CreateType(gearApi);
  }

  signAndSend(account: AddressOrPair, callback: TransactionStatusCb): Promise<() => void>;

  signAndSend(account: AddressOrPair, options?: Partial<SignerOptions>): Promise<Hash>;

  signAndSend(
    account: AddressOrPair,
    options: Partial<SignerOptions>,
    callback: TransactionStatusCb,
  ): Promise<() => void>;

  public async signAndSend(
    account: AddressOrPair,
    optionsOrCallback?: Partial<SignerOptions> | TransactionStatusCb,
    optionalCallback?: TransactionStatusCb,
  ): Promise<Hash | (() => void)> {
    const [options, callback] = isFunction(optionsOrCallback)
      ? [undefined, optionsOrCallback]
      : [optionsOrCallback, optionalCallback];

    try {
      return await this.submitted.signAndSend(account, options, callback);
    } catch (error) {
      const errorCode = +error.message.split(':')[0];
      if (errorCode === 1010) {
        throw new TransactionError('Account balance too low');
      } else {
        throw new TransactionError(error.message);
      }
    }
  }
}
