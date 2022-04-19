import { AccountId, MessageId } from './ids';
import { HumanedMessage } from './interfaces';

export type MailboxType = [[AccountId, MessageId], HumanedMessage][];
