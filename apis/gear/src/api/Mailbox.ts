import { AccountId32 } from '@polkadot/types/interfaces';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { Option } from '@polkadot/types';

import { MailboxItem, HexString } from '../types';
import { GearTransaction } from './Transaction';
import { ClaimValueError } from '../errors';

export class GearMailbox extends GearTransaction {
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
      const mailbox = await this._api.query.gearMessenger.mailbox(accountId, messageId);
      const typedMailbox = this._api.createType(
        'Option<(UserStoredMessage, GearCommonStoragePrimitivesInterval)>',
        mailbox,
      ) as Option<MailboxItem>;
      return typedMailbox.unwrapOr(null);
    } else {
      const keyPrefixes = this._api.query.gearMessenger.mailbox.keyPrefix(accountId);
      const keysPaged = await this._api.rpc.state.getKeysPaged(keyPrefixes, numberOfMessages, keyPrefixes);
      if (keysPaged.length === 0) {
        return [];
      }
      const mailbox = (await this._api.rpc.state.queryStorageAt(keysPaged)) as Option<MailboxItem>[];
      return mailbox.map((item) => {
        const typedItem = this._api.createType(
          'Option<(UserStoredMessage, GearCommonStoragePrimitivesInterval)>',
          item,
        ) as Option<MailboxItem>;
        return typedItem.unwrapOr(null);
      });
    }
  }

  /**
   * ## Create `claimValue` extrinsic
   * @param messageId MessageId with value to be claimed
   */
  claimValue(messageId: HexString): SubmittableExtrinsic<'promise', ISubmittableResult> {
    try {
      this.extrinsic = this._api.tx.gear.claimValue(messageId);
      return this.extrinsic;
    } catch (_) {
      throw new ClaimValueError();
    }
  }
}
