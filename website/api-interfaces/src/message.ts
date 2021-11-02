export interface Message {
  id: string;
  chain: string;
  destination: string;
  source: string;
  payload?: string;
  replyTo?: string;
  replyError?: string;
  isRead: boolean;
  date: Date;
}

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

export interface GetIncomingMessagesParams {
  chain: string;
  destination?: string;
  isRead?: boolean;
  limit?: number;
  offset?: number;
}
export interface GetOutgoingMessagesParams {
  chain: string;
  source?: string;
  isRead?: boolean;
  limit?: number;
  offset?: number;
}
