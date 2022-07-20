import { Option } from '@polkadot/types';

import { Hex, WaitlistItem } from './types';
import { GearApi } from './GearApi';

export class GearWaitlist {
  api: GearApi;

  constructor(gearApi: GearApi) {
    this.api = gearApi;
  }

  /**
   * ## _Read program's waitlist_
   * @param programId 
   * @param numberOfMessages _(default 1000)_ number of messages that will be read from program's waitlist 
   * @example
   * ```javascript
   * const api = await GearApi.create();
   * const waitlist = await api.waitlist.read('0xe0c6997d0bd83269ec108474494e2bd6ed156b30de599b9f2c91e82bb6ad04e8');
   * console.log(waitlist);
   * ```
   */
  async read(programId: Hex, numberOfMessages?: number): Promise<WaitlistItem[]>;

  /**
   * ## _Get particular message from program's waitlist_
   * @param programId 
   * @param messageId 
   * @example
   * ```javascript
   * const api = await GearApi.create();
   * const programId = '0xe0c6997d0bd83269ec108474494e2bd6ed156b30de599b9f2c91e82bb6ad04e8'
   * const messageId = '0xe9f3b99f23203d0c032868d3bd0349c8e243119626a8af98a2f4ac5ea6c78947'
   * const waitlist = await api.waitlist.read(programId, messageId);
   * console.log(waitlist);
   * ```
   */
  async read(programId: Hex, messageId: Hex): Promise<WaitlistItem>;

  async read(programId: Hex, messageIdOrNumberOfMessages?: Hex | number): Promise<WaitlistItem[] | WaitlistItem> {
    const [messageId, numberOfMessages] = typeof messageIdOrNumberOfMessages === 'string' ? [messageIdOrNumberOfMessages, undefined] : [undefined, messageIdOrNumberOfMessages || 1000];
    
    if (messageId) {
      const waitlist = await this.api.query.gearMessenger.waitlist(programId, messageId);
      const typedWaitlist = this.api.createType('Option<(GearCoreMessageStoredStoredDispatch, GearCommonStoragePrimitivesInterval)>', waitlist) as Option<WaitlistItem>;
      return typedWaitlist.unwrapOr(null);
    } else {
      const keyPrefix = this.api.query.gearMessenger.waitlist.keyPrefix(programId);
      const keysPaged = await this.api.rpc.state.getKeysPaged(keyPrefix, numberOfMessages, keyPrefix);
      if (keysPaged.length === 0) {
        return [];
      }
      const waitlist = await this.api.rpc.state.queryStorageAt(keysPaged) as Option<WaitlistItem>[];      
      return waitlist.map((item) => {
        const typedItem = this.api.createType('Option<(GearCoreMessageStoredStoredDispatch, GearCommonStoragePrimitivesInterval)>', item);
        return typedItem.unwrapOr(null);
      }) as WaitlistItem[];
    }
  }
}
