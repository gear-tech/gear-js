import { ApiPromise } from '@polkadot/api';
import { GearApi, Message } from '.';
import { Option, BTreeMap } from '@polkadot/types';
import { AccountId32, H256 } from '@polkadot/types/interfaces';

export class GearMailbox {
  api: ApiPromise;
  constructor(api: GearApi) {
    this.api = api.api;
  }

  async readMailbox(accountId: string | AccountId32): Promise<Option<BTreeMap<H256, Message>>> {
    this.api.query.gear.mailbox(accountId);
    return this.api.query.gear.mailbox(accountId);
  }
}
