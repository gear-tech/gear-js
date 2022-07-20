import { AccountId32 } from '@polkadot/types/interfaces';
import { UnsubscribePromise } from '@polkadot/api/types';
import { Option } from '@polkadot/types';

import { Hex, MailboxItem } from './types';
import { GearClaimValue } from './Claim';
import { GearApi } from './GearApi';

export class GearMailbox {
  api: GearApi;
  subscription: UnsubscribePromise;
  claimValue: GearClaimValue;

  constructor(gearApi: GearApi) {
    this.api = gearApi;
    this.claimValue = gearApi.claimValueFromMailbox;
  }

  async read(accountId: Hex, numberOfMessages?: number): Promise<MailboxItem[]>;

  async read(accountId: Hex, messageId: Hex): Promise<MailboxItem>;
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
  async read(
    accountId: Hex | AccountId32 | string,
    messageIdOrNumberOfMessages?: Hex | number,
  ): Promise<MailboxItem[] | MailboxItem> {
    const [messageId, numberOfMessages] =
      typeof messageIdOrNumberOfMessages === 'string'
        ? [messageIdOrNumberOfMessages, undefined]
        : [undefined, messageIdOrNumberOfMessages || 1000];
    if (messageId) {
      const mailbox = await this.api.query.gearMessenger.mailbox(accountId, messageId);
      const typedMailbox = this.api.createType(
        'Option<(GearCoreMessageStoredStoredMessage, GearCommonStoragePrimitivesInterval)>',
        mailbox,
      ) as Option<MailboxItem>;
      return typedMailbox.unwrapOr(null);
    } else {
      const keyPrefixes = this.api.query.gearMessenger.mailbox.keyPrefix(accountId);
      const keysPaged = await this.api.rpc.state.getKeysPaged(keyPrefixes, numberOfMessages, keyPrefixes);
      if (keysPaged.length === 0) {
        return [];
      }
      const mailbox = (await this.api.rpc.state.queryStorageAt(keysPaged)) as Option<MailboxItem>[];
      return mailbox.map((item) => {
        const typedItem = this.api.createType(
          'Option<(GearCoreMessageStoredStoredMessage, GearCommonStoragePrimitivesInterval)>',
          item,
        ) as Option<MailboxItem>;
        return typedItem.unwrapOr(null);
      });
    }
  }
}
