import { HexString } from '@gear-js/api';

import { IBase } from '@/shared/types';
import { PaginationParameters, PaginationResponse } from '@/api';

import { MessageEntryPoint, MessageReadReason } from '../types';

type MessagesToProgramParameters = PaginationParameters & {
  destination?: string;
  source?: string;
  entry?: MessageEntryPoint; // maybe no need to export from types
};

type MessagesFromProgramParameters = PaginationParameters & {
  destination?: string;
  source?: string;
  isInMailbox?: boolean;
};

type MessageBase = IBase & {
  id: HexString;
  destination: HexString;
  source: HexString;
  value: string;
  payload: HexString | null;
  replyToMessageId?: HexString | null;
};

type MessageToProgram = MessageBase & {
  entry: MessageEntryPoint | null;
  processedWithPanic?: boolean | null;
};

type MessageFromProgram = MessageBase & {
  exitCode?: number | null;
  expiration?: number | null;
  readReason?: MessageReadReason | null; // maybe no need to export from types
};

export type {
  MessageToProgram,
  MessageFromProgram,
  MessagesToProgramParameters,
  MessagesFromProgramParameters,
  PaginationResponse,
};
