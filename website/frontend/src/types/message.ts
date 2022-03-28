export interface MessageModel {
  destination: string;
  source: string;
  id: string;
  timestamp: string;
  replyError: any;
  payload: string;
}

export interface MessagePaginationModel {
  count: number;
  messages: MessageModel[];
}
