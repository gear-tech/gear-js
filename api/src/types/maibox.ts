import { Hex } from './common';
import { HumanStoredMessage } from './interfaces';

// 1: AccountId, 2: MessageId
export type MailboxRecord = [[Hex, Hex], HumanStoredMessage];
