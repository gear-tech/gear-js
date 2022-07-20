import { Tuple } from '@polkadot/types';
import { BlockNumber } from '@polkadot/types/interfaces';
import { Interval, StoredMessage } from './base';

export interface MailboxItem extends Tuple {
  0: StoredMessage,
  1: Interval<BlockNumber>
}
