import type { HexString } from '@gear-js/api';

import type { IBase } from '@/shared/types';

import type { MESSAGE_ENTRY_POINT, MESSAGE_READ_REASON, MESSAGE_TYPE } from './consts';

type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];
type MessageReadReason = (typeof MESSAGE_READ_REASON)[keyof typeof MESSAGE_READ_REASON];
type MessageEntryPoint = (typeof MESSAGE_ENTRY_POINT)[keyof typeof MESSAGE_ENTRY_POINT];

type Message = IBase & {
  id: HexString;
  destination: HexString;
  source: HexString;
  value: string;
  payload: HexString;
  entry: MessageEntryPoint | null;
  replyToMessageId: HexString | null;
  exitCode: number | null;
  processedWithPanic: boolean;
  type: MessageType;
  readReason: MessageReadReason | null;
  metahash?: HexString | null;
};

export type { Message, MessageEntryPoint, MessageReadReason };
