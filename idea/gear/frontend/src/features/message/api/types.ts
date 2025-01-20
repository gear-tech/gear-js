import { HexString } from '@gear-js/api';

import { IBase } from '@/shared/types';
import { PaginationParameters, PaginationResponse } from '@/api';

import { MessageEntryPoint, MessageReadReason } from '../types';

type BaseMessagesParameters = PaginationParameters & {
  destination?: string;
  source?: string;
  service?: string;
  fn?: string;
};

type MessagesToProgramParameters = BaseMessagesParameters & {
  entry?: MessageEntryPoint;
};

type MessagesFromProgramParameters = BaseMessagesParameters & {
  isInMailbox?: boolean;
};

type BaseMessage = IBase & {
  id: HexString;
  destination: HexString;
  source: HexString;
  value: string;
  payload: HexString | null;
  replyToMessageId?: HexString | null;
  service?: string | null;
  fn?: string | null;
};

type MessageToProgram = BaseMessage & {
  entry: MessageEntryPoint | null;
  processedWithPanic?: boolean | null;
};

type MessageFromProgram = BaseMessage & {
  exitCode?: number | null;
  expiration?: number | null;
  readReason?: MessageReadReason | null;
};

export type {
  MessageToProgram,
  MessageFromProgram,
  MessagesToProgramParameters,
  MessagesFromProgramParameters,
  PaginationResponse,
};
