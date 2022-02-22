import { State, MailsAction, MailsActionTypes } from './types';

export const reducer = (state: State, action: MailsAction) => {
  switch (action.type) {
    case MailsActionTypes.FETCH_MAILS:
      return { ...state, mails: action.payload };
    default:
      return state;
  }
};
