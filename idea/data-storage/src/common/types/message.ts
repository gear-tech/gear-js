import { HexString } from '@polkadot/util/types';
import { MessageReadReason } from '@gear-js/common';

import { MessageStatus } from '../enums';
import { BaseDataInput } from './gear';

export interface UserMessageReadInput extends BaseDataInput {
  id: string;
  reason: MessageReadReason | null;
}

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

export interface MessagesDispatchedDataInput extends BaseDataInput {
  statuses: { [key: string]: MessageStatus };
}
