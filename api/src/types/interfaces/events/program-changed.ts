import { Null, Enum } from '@polkadot/types';
import { BlockNumber, H256 } from '@polkadot/types/interfaces';

export interface ProgramChangedKind extends Enum {
  isActive: boolean;
  isInactive: boolean;
  isPaused: boolean;
  asActive: { expiration: BlockNumber };
  asInactive: Null;
  asPaused: {
    code_hash: H256;
    memory_hash: H256;
    waitlist_hash: H256;
  };
}
