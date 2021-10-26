import { GearApi } from '.';
import { Vec } from '@polkadot/types';
import { ApiPromise } from '@polkadot/api';
import { ISubmittableResult } from '@polkadot/types/types';
import { AddressOrPair, SignerOptions, SubmittableExtrinsic } from '@polkadot/api/types';
import { Call, Hash } from '@polkadot/types/interfaces';

export class Batch {
  api: ApiPromise;
  batch: SubmittableExtrinsic<'promise', ISubmittableResult>;
  signAndSend: (
    account: AddressOrPair,
    options?: Partial<SignerOptions>,
    statusCb?: (result: ISubmittableResult, extra: undefined) => void | Promise<void>
  ) => Promise<Hash> | void | Promise<void>;

  constructor(api: GearApi) {
    this.api = api.api;
    this.signAndSend = this.batch.signAndSend;
  }

  submit(
    calls:
      | Vec<Call>
      | (
          | string
          | Uint8Array
          | Call
          | {
              callIndex?: any;
              args?: any;
            }
        )[]
  ) {
    this.batch = this.api.tx.utility.batch(calls);
    return this.batch;
  }
}
