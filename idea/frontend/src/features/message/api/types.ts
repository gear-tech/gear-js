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

type Message = IBase & {
  id: string;
  destination: string;
  source: string;
  value: string;
  payload: string | null;
  replyToMessageId?: string | null;
};

type MessageToProgram = Message & {
  entry: MessageEntryPoint | null;
  processedWithPanic?: boolean | null;
};

type MessageFromProgram = Message & {
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
