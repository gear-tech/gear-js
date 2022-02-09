import { GearApi } from './GearApi';
import { Hex, Message } from './interfaces';
import { Option, BTreeMap } from '@polkadot/types';
import { AccountId32, H256 } from '@polkadot/types/interfaces';
import { UnsubscribePromise } from '@polkadot/api/types';
import { GearClaimValue } from './Claim';
export class GearMailbox {
  api: GearApi;
  subscription: UnsubscribePromise;
  claimValue: GearClaimValue;

  constructor(gearApi: GearApi) {
    this.api = gearApi;
    this.claimValue = gearApi.claimValueFromMailbox;
  }

  /**
   * Read mailbox
   * @param accountId
   * @returns
   * @example
   * ```javascript
   * const api = await GearApi.create();
   * const mailbox = await api.mailbox.read('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
   * console.log(mailbox.toHuman());
   * ```
   */
  async read(accountId: Hex | AccountId32 | string): Promise<Option<BTreeMap<H256, Message>>> {
    return this.api.query.gear.mailbox(accountId) as Promise<Option<BTreeMap<H256, Message>>>;
  }

  /**
   * Subscribe to user mailbox changes
   * @param accountId AccountId in hex or base58 format
   * @param callback callback with mailbox data
   * @examples
   * ```javascript
   * gearApi.mailbox.subscribe('0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', (data) => {
   *    console.log(data.toHuman())
   * })
   * ```
   */
  subscribe(
    accountId: Hex | AccountId32 | string,
    callback: (data: Option<BTreeMap<H256, Message>>) => void,
  ): UnsubscribePromise {
    this.subscription = this.api.query.gear.mailbox(accountId, callback);
    return this.subscription;
  }

  /**
   * Unsubscribe from user mailbox changes
   */
  unsubscribe() {
    this.subscription.then((fn) => {
      fn();
    });
  }
}
