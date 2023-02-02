import { HexString } from '@polkadot/util/types';
import { BaseDataInput } from '../../gear/types';

export interface UserMessageSentInput extends BaseDataInput {
  id: HexString;
  destination: HexString;
  source: HexString;
  payload?: HexString;
  value?: string;
  entry?: string;
  replyToMessageId?: string | null;
  exitCode?: number | null;
  expiration?: number | null;
}
