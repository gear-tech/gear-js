interface IMessage {
  id: string;
  destination: string;
  source: string;
  payload?: string;
  value?: string;
  entry?: string;
  replyToMessageId?: string | null;
  exitCode?: number | null;
  expiration?: number | null;
}

interface IMessageEnqueuedData {
  id: string;
  destination: string;
  source: string;
  entry: 'Init' | 'Handle' | 'Reply';
}

interface IMessagesDispatchedData {
  statuses: { [key: string]: 'Success' | 'Failed' };
}

enum MESSAGE_TYPE {
  USER_MESS_SENT = 'UserMessageSent',
  ENQUEUED = 'Enqueued',
}

enum MESSAGE_READ_STATUS {
  OUT_OF_RENT = 'OutOfRent',
  CLAIMED = 'Claimed',
  REPLIED = 'Replied',
}

export { IMessage, IMessageEnqueuedData, IMessagesDispatchedData, MESSAGE_TYPE, MESSAGE_READ_STATUS };
