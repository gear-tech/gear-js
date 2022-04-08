import { AccountId, MessageId } from './gear-api';
import { HumanedMessage } from './message';

export type IMailbox = [[AccountId, MessageId], HumanedMessage][];
