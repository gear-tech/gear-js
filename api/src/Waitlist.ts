import { Option, StorageKey } from '@polkadot/types';
import { AnyTuple } from '@polkadot/types/types';

import { Hex, ProgramId, MessageId, StoredDispatch, WaitlistItem } from './types';
import { StoredMessage } from './types/interfaces';
import { GearApi } from './GearApi';

export class GearWaitlist {
  api: GearApi;

  constructor(gearApi: GearApi) {
    this.api = gearApi;
  }

  async read(programId: Hex): Promise<WaitlistItem[]>;
  async read(programId: Hex, messageId: Hex): Promise<WaitlistItem>;

  /**
   *
   * @param programId
   * @param messageId
   * @returns Waitlist of particular program if messageId was not specified
   * @example
   * ```javascript
   * const api = await GearApi.create();
   * const waitlist = await api.waitlist.read('0xe0c6997d0bd83269ec108474494e2bd6ed156b30de599b9f2c91e82bb6ad04e8');
   * console.log(waitlist);
   * ```
   */
  async read(programId: Hex, messageId?: Hex): Promise<WaitlistItem[] | WaitlistItem> {
    if (messageId) {
      const waitlist = (await this.api.query.gearMessenger.waitlist(programId, messageId)) as Option<StoredMessage>;
      return this.transformWaitlist(waitlist.unwrapOr(null));
    } else {
      const keys = await this.api.query.gearMessenger.waitlist.keys(programId);
      if (keys.length === 0) {
        return [];
      }
      const keyPrefixes = this.api.query.gearMessenger.waitlist.keyPrefix(programId);
      const keysPaged = await this.api.rpc.state.getKeysPaged(keyPrefixes, 1000, keyPrefixes);
      const waitlist = (await this.api.rpc.state.queryStorageAt(keysPaged)) as Option<StoredMessage>[];
      return waitlist.map((option, index) => this.transformWaitlist(option.unwrap(), keys[index]));
    }
  }

  private transformWaitlist(option: StoredMessage, keys?: StorageKey<AnyTuple>): WaitlistItem {
    if (option === null) {
      return null;
    }
    const [storedDispatched, blockNumber] = this.api.createType('(GearCoreMessageStoredStoredDispatch, u32)', option);
    const result = {
      blockNumber: blockNumber.toNumber(),
      storedDispatch: storedDispatched.toHuman() as unknown as StoredDispatch,
    };
    if (keys) {
      const [programId, messageId] = keys.toHuman() as [ProgramId, MessageId];
      result['programId'] = programId;
      result['messageId'] = messageId;
    }
    return result;
  }
}
