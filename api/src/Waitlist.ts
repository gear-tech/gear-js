import { GearApi } from './GearApi';
import { HumanedMessage, StoredMessage } from './types/interfaces';
import { MailboxType, AccountId, Hex } from './types';
import { Option, Vec } from '@polkadot/types';
import { AccountId32, H256 } from '@polkadot/types/interfaces';
import { UnsubscribePromise } from '@polkadot/api/types';
import { GearClaimValue } from './Claim';

const WAITLIST_PREFIX = Buffer.from('g::wait::').toString('hex');

export class GearWaitlist {
  api: GearApi;

  constructor(gearApi: GearApi) {
    this.api = gearApi;
  }

  async readProgramWaitlist(programId: Hex) {
    const waitlist = await this.api.rpc.state.getStorage(`0x${WAITLIST_PREFIX}${programId.slice(2)}`);
    console.log(waitlist);
  }
}
