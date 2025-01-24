import { AddressOrPair, SignerOptions, SubmittableExtrinsic } from '@polkadot/api/types';
import { Hash, RuntimeDispatchInfo } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';
import { isFunction } from '@polkadot/util';

import { GearApi } from './GearApi';
import { TransactionError } from './errors';
import { TransactionStatusCb } from './types';

export class GearTransaction {
  extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>;

  constructor(protected _api: GearApi) {}

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
      return await this.extrinsic.signAndSend(account, options, callback);
    } catch (error) {
      console.log(error);
      const errorCode = +error.message.split(':')[0];
      if (errorCode === 1010) {
        throw new TransactionError('Account balance too low');
      } else {
        throw new TransactionError(error.message);
      }
    }
  }

  /**
   *
   * @param account
   * @param options
   * @example
   * ```javascript
   * const api = await GearApi.create();
   * api.program.submit({code, gasLimit});
   * // same for api.message, api.reply and others
   * const paymentInfo = await api.program.paymentInfo(alice);
   * const transactionFee = paymentInfo.partialFee.toNumber();
   * consolg.log(transactionFee);
   * ```
   */
  paymentInfo(account: AddressOrPair, options?: Partial<SignerOptions>): Promise<RuntimeDispatchInfo> {
    return this.extrinsic.paymentInfo(account, options);
  }
}
