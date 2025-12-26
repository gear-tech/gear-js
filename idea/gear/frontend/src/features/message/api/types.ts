import { HexString } from '@gear-js/api';

import { PaginationParameters, PaginationResponse } from '@/api';
import { IBase } from '@/shared/types';

import { MessageEntryPoint, MessageReadReason } from '../types';

type MessagesParameters = PaginationParameters & {
  destination?: string;
  source?: string;
  service?: string;
  fn?: string;
  query?: string;
};

type MessagesToProgramParameters = MessagesParameters & {
  entry?: MessageEntryPoint;
};

type MessagesFromProgramParameters = MessagesParameters & {
  isInMailbox?: boolean;
};

type Message = IBase & {
  id: HexString;
  destination: HexString;
  source: HexString;
  value: string;
  payload: HexString | null;
  replyCode?: HexString | null;
  replyToMessageId?: HexString | null;
  service?: string | null;
  fn?: string | null;
};

type MessageToProgram = Message & {
  entry: MessageEntryPoint | null;
  processedWithPanic?: boolean | null;
};

type MessageFromProgram = Message & {
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
