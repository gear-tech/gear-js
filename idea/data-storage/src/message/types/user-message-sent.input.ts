import { Hex } from '@gear-js/api';
import { BaseDataInput } from '../../gear/types';

export interface UserMessageSentInput extends BaseDataInput {
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
