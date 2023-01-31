import { AccountId32 } from '@polkadot/types/interfaces';
import { HexString } from '@polkadot/util/types';
import { Option } from '@polkadot/types';

import { GearApi } from './GearApi';
import { GearClaimValue } from './Claim';
import { MailboxItem } from './types';

export class GearMailbox {
  public claimValue: GearClaimValue;

  constructor(private api: GearApi) {
    this.claimValue = api.claimValueFromMailbox;
  }

  /**
   * ## Read mailbox connected with account
   * @param accountId
   * @param numberOfMessages _(default 1000)_ number of messages that will be read from mailbox
   * ```javascript
   * const alice = '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d'
   * const api = await GearApi.create();
   * const mailbox = await api.mailbox.read(alice);
   * console.log(mailbox.map(item => item.toHuman()));
   * ```
   */
  async read(accountId: HexString, numberOfMessages?: number): Promise<MailboxItem[]>;

  /**
   * ## Get particular message from mailbox
   * @param accountId
   * @param messageId
   * ```javascript
   * const api = await GearApi.create();
   *
   * const alice = '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d'
   * const messageId = '0xe9f3b99f23203d0c032868d3bd0349c8e243119626a8af98a2f4ac5ea6c78947'
   * const mailbox = await api.mailbox.read(alice, messageId);
   * if (mailbox !== null) {
   *   console.log(mailbox.toHuman());
   * }
   * ```
   */
  async read(accountId: HexString, messageId: HexString): Promise<MailboxItem>;

  async read(
    accountId: HexString | AccountId32 | string,
    messageIdOrNumberOfMessages?: HexString | number,
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
