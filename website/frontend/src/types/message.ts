export interface MessageModel {
  destination: string;
  id: string;
  date: string;
  isRead: boolean;
}

export interface MessagePaginationModel {
  count: number;
  messages: MessageModel[];
}

export interface MessageState {
  message: MessageModel | null;
  messages: MessageModel[] | null;
  messagesCount: number | null;

  loading: boolean | null;

  error: null | string;
}

export enum MessageActionTypes {
  FETCH_MESSAGES = 'FETCH_MESSAGES',
  FETCH_MESSAGES_SUCCESS = 'FETCH_MESSAGES_SUCCESS',
  FETCH_MESSAGES_ERROR = 'FETCH_MESSAGES_ERROR',
}

interface FetchMessagesAction {
  type: MessageActionTypes.FETCH_MESSAGES;
}

interface FetchMessagesSuccessAction {
  type: MessageActionTypes.FETCH_MESSAGES_SUCCESS;
  payload: MessagePaginationModel;
}

interface FetchMessagesErrorAction {
  type: MessageActionTypes.FETCH_MESSAGES_ERROR;
  payload: string;
}

export type MessageAction = FetchMessagesAction | FetchMessagesSuccessAction | FetchMessagesErrorAction;
