import { GearApi } from './GearApi';
import { Message } from './interfaces';
import { Option, BTreeMap } from '@polkadot/types';
import { AccountId32, H256 } from '@polkadot/types/interfaces';

export class GearMailbox {
  api: GearApi;
  constructor(gearApi: GearApi) {
    this.api = gearApi;
  }

  async readMailbox(accountId: string | AccountId32): Promise<Option<BTreeMap<H256, Message>>> {
    return (await this.api.query.gear.mailbox(accountId)) as Option<BTreeMap<H256, Message>>;
  }
}
