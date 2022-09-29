import { Hex } from '@gear-js/api';

export interface UserMessageSentInput {
  id: Hex;
  destination: Hex;
  source: Hex;
  payload?: Hex;
  value?: string;
  entry?: string;
  replyToMessageId?: string | null;
  exitCode?: number | null;
  expiration?: number | null;
}
