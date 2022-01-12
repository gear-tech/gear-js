import { PaginationParams, RequestParams } from './general';

export interface Message {
  id: string;
  chain: string;
  genesis: string;
  destination: string;
  source: string;
  payload?: string;
  replyTo?: string;
  replyError?: string;
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

export interface GetMessagesParams extends RequestParams, PaginationParams {
  destination?: string;
  source?: string;
}

export interface FindMessageParams extends RequestParams, Pick<Message, 'id'> {}

export interface GetIncomingMessagesParams
  extends RequestParams,
    PaginationParams,
    Pick<GetMessagesParams, 'destination'> {}

export interface GetOutgoingMessagesParams extends RequestParams, PaginationParams, Pick<GetMessagesParams, 'source'> {}
