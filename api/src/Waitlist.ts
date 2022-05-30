import { GearApi } from './GearApi';
import { StoredMessage } from './types/interfaces';
import { Hex, ProgramId, MessageId } from './types';
import { Option, Vec } from '@polkadot/types';
import { WaitlistType } from 'types/waitlist';

export class GearWaitlist {
  api: GearApi;

  constructor(gearApi: GearApi) {
    this.api = gearApi;
  }
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
  async read(programId: Hex, messageId?: Hex): Promise<WaitlistType> {
    if (messageId) {
      const waitlist = await this.api.query.gearMessenger.waitlist(programId, messageId);
      return waitlist.toHuman() as WaitlistType;
    } else {
      const keys = await this.api.query.gearMessenger.waitlist.keys(programId);
      if (keys.length === 0) {
        return [];
      }
      const keyPrefixes = this.api.query.gearMessenger.waitlist.keyPrefix(programId);
      const keysPaged = await this.api.rpc.state.getKeysPaged(keyPrefixes, 1000, keyPrefixes);
      const waitlist = (await this.api.rpc.state.queryStorageAt(keysPaged)) as Option<StoredMessage>[];
      return waitlist.map((option, index) => {
        return [
          keys[index].toHuman() as [ProgramId, MessageId],
          this.api.createType('GearCoreMessageStoredStoredDispatch', option.unwrap()).toHuman() as unknown,
        ];
      }) as WaitlistType;
    }
  }
}
