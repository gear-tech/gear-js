import { Hex } from '@gear-js/api';

export interface MessageModel {
  id: string;
  entry: 'Init' | 'Handle' | 'Reply' | null;
  value: string;
  source: string;
  payload: string;
  exitCode: number | null;
  timestamp: string;
  expiration: null | number;
  destination: string;
  replyToMessageId: Hex | null;
  processedWithPanic: boolean;
}

export interface MessagePaginationModel {
  count: number;
  messages: MessageModel[];
}
