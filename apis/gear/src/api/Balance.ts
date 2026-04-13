import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Balance } from '@polkadot/types/interfaces';
import type { FrameSystemAccountInfo } from '@polkadot/types/lookup';
import type { ISubmittableResult } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';

import { GearTransaction } from './Transaction';

export class GearBalance extends GearTransaction {
  async findOut(publicKey: string): Promise<Balance> {
    const { data: balance } = (await this._api.query.system.account(publicKey)) as FrameSystemAccountInfo;
    return this._api.createType('Balance', balance.free) as Balance;
  }

  transfer(to: string, value: number | BN, keepAlive = true): SubmittableExtrinsic<'promise', ISubmittableResult> {
    this.extrinsic = this._api.tx.balances[keepAlive ? 'transferKeepAlive' : 'transferAllowDeath'](to, value);
    return this.extrinsic;
  }
}
