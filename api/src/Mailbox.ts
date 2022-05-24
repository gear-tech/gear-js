import { GearApi } from './GearApi';
import { HumanedMessage, StoredMessage } from './types/interfaces';
import { MailboxType, AccountId, Hex } from './types';
import { Option } from '@polkadot/types';
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
   * console.log(mailbox);
   * ```
   */
  async read(accountId: Hex | AccountId32 | string, messageId?: Hex | H256): Promise<MailboxType> {
    if (messageId) {
      const mailbox = await this.api.query.gearMessenger.mailbox(accountId, messageId);
      return mailbox.toHuman() as MailboxType;
    } else {
      const keys = await this.api.query.gearMessenger.mailbox.keys(accountId);
      if (keys.length === 0) {
        return [];
      }
      const keyPrefixes = this.api.query.gearMessenger.mailbox.keyPrefix(accountId);
      const keysPaged = await this.api.rpc.state.getKeysPaged(keyPrefixes, 1000, keyPrefixes);
      const mailbox = (await this.api.rpc.state.queryStorageAt(keysPaged)) as Option<StoredMessage>[];
      return mailbox.map((option, index) => {
        return [
          keys[index].toHuman() as [AccountId, Hex],
          this.api
            .createType('GearCoreMessageStoredStoredMessage', option.unwrap())
            .toHuman() as unknown as HumanedMessage,
        ];
      });
    }
  }
}
