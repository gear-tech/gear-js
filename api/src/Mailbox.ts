import { GearApi } from './GearApi';
import { Message } from './interfaces';
import { Option, BTreeMap } from '@polkadot/types';
import { AccountId32, H256 } from '@polkadot/types/interfaces';
import { UnsubscribePromise } from '@polkadot/api/types';

export class GearMailbox {
  api: GearApi;
  subscription: UnsubscribePromise;
  constructor(gearApi: GearApi) {
    this.api = gearApi;
  }

  read(accountId: string | AccountId32): Option<BTreeMap<H256, Message>> {
    return this.api.query.gear.mailbox(accountId);
  }

  subscribe(accountId: string, callback: (data: Option<BTreeMap<H256, Message>>) => void): UnsubscribePromise {
    this.subscription = this.api.query.gear.mailbox(accountId, callback);
    return this.subscription;
  }

  unsubscribe() {
    this.subscription.then((fn) => {
      fn();
    });
  }
}
