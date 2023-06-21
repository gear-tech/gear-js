import { Enum, Null } from '@polkadot/types';
import { BlockNumber } from '@polkadot/types/interfaces';

export interface ProgramChangedKind extends Enum {
  isActive: boolean;
  asActive: { expiration: BlockNumber };
  isInactive: boolean;
  asInactive: Null;
  isPaused: boolean;
  asPaused: Null;
  isTerminated: boolean;
  asTerminated: Null;
  isExpirationChanged: boolean;
  asExpirationChanged: { expiration: BlockNumber };
  isProgramSet: boolean;
  asProgramSet: { expiration: BlockNumber };
}
