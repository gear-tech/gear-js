import { BlockNumber } from '@polkadot/types/interfaces';
import { Tuple } from '@polkadot/types';

import { Interval, StoredMessage } from './base';

export interface MailboxItem extends Tuple {
  0: StoredMessage;
  1: Interval<BlockNumber>;
}
