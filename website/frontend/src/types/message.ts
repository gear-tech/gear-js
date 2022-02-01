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
  FETCH_MESSAGE = 'FETCH_MESSAGE',
  FETCH_MESSAGE_SUCCESS = 'FETCH_MESSAGE_SUCCESS',
  FETCH_MESSAGE_ERROR = 'FETCH_MESSAGE_ERROR',
  RESET_MESSAGE = 'RESET_MESSAGE',
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

interface FetchMessageAction {
  type: MessageActionTypes.FETCH_MESSAGE;
}

interface FetchMessageSuccessAction {
  type: MessageActionTypes.FETCH_MESSAGE_SUCCESS;
  payload: MessageModel;
}

interface FetchMessageErrorAction {
  type: MessageActionTypes.FETCH_MESSAGE_ERROR;
  payload: string;
}

interface ResetMessageAction {
  type: MessageActionTypes.RESET_MESSAGE;
}

export type MessageAction =
  | FetchMessagesAction
  | FetchMessagesSuccessAction
  | FetchMessagesErrorAction
  | FetchMessageAction
  | FetchMessageSuccessAction
  | FetchMessageErrorAction
  | ResetMessageAction;
