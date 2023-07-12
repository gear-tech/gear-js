import { BlockNumber } from '@polkadot/types/interfaces';
import { Tuple } from '@polkadot/types';

import { Interval, UserStoredMessage } from './base';

export interface MailboxItem extends Tuple {
  0: UserStoredMessage;
  1: Interval<BlockNumber>;
}
