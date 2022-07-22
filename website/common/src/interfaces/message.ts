import { MESSAGE_READ_STATUS } from '../enums';

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

interface IUserMessageReadData {
  id: string;
  reason: MESSAGE_READ_STATUS | null;
}

interface UpdateMessageData {
  messageId: string;
  payload: string;
  genesis: string;
  value: string;
}

export { IMessage, IMessageEnqueuedData, IMessagesDispatchedData, IUserMessageReadData, UpdateMessageData };
