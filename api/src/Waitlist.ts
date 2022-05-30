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
