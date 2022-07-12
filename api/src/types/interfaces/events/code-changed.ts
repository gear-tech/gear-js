import { Null, Enum, Option } from '@polkadot/types';
import { BlockNumber } from '@polkadot/types/interfaces';

export interface CodeChangeKind extends Enum {
  isActive: boolean;
  isInactive: boolean;
  isReinstrumented: boolean;
  asActive: { expiration: Option<BlockNumber> };
  asInactive: Null;
  asReinstrumented: Null;
}
