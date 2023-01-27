import { BlockNumber } from '@polkadot/types/interfaces';
import { Tuple } from '@polkadot/types';

import { Interval, StoredDispatch } from './base';

export interface WaitlistItem extends Tuple {
  0: StoredDispatch;
  1: Interval<BlockNumber>;
}
