import { Message } from './entities/message.entity';

export interface AddPayloadParams {
  id: string;
  chain: string;
  payload: string;
  signature: string;
}

export interface AllMessagesResult {
  messages: Message[];
  count: number;
}

export interface GetMessagesParams {
  chain: string;
  destination?: string;
  source?: string;
  isRead?: boolean;
  limit?: number;
  offset?: number;
}
