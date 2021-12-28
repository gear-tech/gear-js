import { RequestParams } from './general';

export interface Message {
  id: string;
  chain: string;
  genesis: string;
  destination: string;
  source: string;
  payload?: string;
  replyTo?: string;
  replyError?: string;
  isRead: boolean;
  date: Date;
}

export interface AddPayloadParams extends RequestParams {
  id: string;
  payload: string;
  signature: string;
}

export interface AllMessagesResult {
  messages: Message[];
  count: number;
}

export interface GetMessagesParams extends RequestParams {
  destination?: string;
  source?: string;
  isRead?: boolean;
  limit?: number;
  offset?: number;
}

export interface FindMessageParams extends RequestParams, Pick<Message, 'id'> {}

export interface GetIncomingMessagesParams extends RequestParams {
  destination?: string;
  isRead?: boolean;
  limit?: number;
  offset?: number;
}
export interface GetOutgoingMessagesParams extends RequestParams {
  source?: string;
  isRead?: boolean;
  limit?: number;
  offset?: number;
}
