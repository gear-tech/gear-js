interface IMessage {
  id: string;
  destination: string;
  source: string;
  payload?: string;
  error?: string;
  replyTo?: string | null;
  replyError?: string | null;
}

interface IMessageEnqueuedData {
  id: string;
  destination: string;
  source: string;
  entry: 'Init' | 'Handle' | 'Reply';
}

interface IMessagesDispatchedData {
  statuses: { [key: string]: 'Success' | 'Failure' };
}

interface ICodeChangedData {
  id: string;
  change: string;
}

export { IMessage, IMessageEnqueuedData, IMessagesDispatchedData, ICodeChangedData };
