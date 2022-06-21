import { ISystemAccountInfo } from './types/interfaces';
import { Balance } from '@polkadot/types/interfaces';
import { BN } from '@polkadot/util';
import { GearTransaction } from './Transaction';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { GearApi } from './GearApi';

export class GearBalance extends GearTransaction {
  constructor(gearApi: GearApi) {
    super(gearApi);
  }

  async findOut(publicKey: string): Promise<Balance> {
    const { data: balance } = (await this.api.query.system.account(publicKey)) as ISystemAccountInfo;
    return this.api.createType('Balance', balance.free) as Balance;
  }

  transfer(to: string, value: number | BN): SubmittableExtrinsic<'promise', ISubmittableResult> {
    this.submitted = this.api.tx.balances.transfer(to, value);
    return this.submitted;
  }
}
