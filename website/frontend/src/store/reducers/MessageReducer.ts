import { MessageState, MessageAction, MessageActionTypes } from 'types/message';

const initialState: MessageState = {
  message: null,
  messages: null,
  messagesCount: null,

  loading: false,

  error: null,
};

const MessageReducer = (state = initialState, action: MessageAction): MessageState => {
  switch (action.type) {
    case MessageActionTypes.FETCH_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        messages: action.payload.messages,
        messagesCount: action.payload.count,
      };
    case MessageActionTypes.FETCH_MESSAGES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        messages: null,
        messagesCount: null,
      };
    default:
      return state;
  }
};

export default MessageReducer;
