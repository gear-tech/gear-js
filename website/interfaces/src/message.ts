export interface IMessage {
  id: string;
  destination: string;
  source: string;
  payload?: string;
  error?: string;
  replyTo?: string | null;
  replyError?: string | null;
}

export interface IMessageEnqueuedData {
  id: string;
  destination: string;
  source: string;
  entry: 'Init' | 'Handle' | 'Reply';
}

export interface IMessagesDispatchedData {
  statuses: { [key: string]: 'Success' | 'Failure' };
}
