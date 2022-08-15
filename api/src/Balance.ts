import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { Balance } from '@polkadot/types/interfaces';
import { BN } from '@polkadot/util';

import { GearTransaction } from './Transaction';
import { ISystemAccountInfo } from './types';

export class GearBalance extends GearTransaction {
  async findOut(publicKey: string): Promise<Balance> {
    const { data: balance } = (await this._api.query.system.account(publicKey)) as ISystemAccountInfo;
    return this._api.createType('Balance', balance.free) as Balance;
  }

  transfer(to: string, value: number | BN): SubmittableExtrinsic<'promise', ISubmittableResult> {
    this.extrinsic = this._api.tx.balances.transfer(to, value);
    return this.extrinsic;
  }
}
