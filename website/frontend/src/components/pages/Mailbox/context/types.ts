export type State = {
  mails: string[];
};

export type Dispatch = (action: MailsAction) => void;

export enum MailsActionTypes {
  FETCH_MAILS = 'FETCH_MAILS',
  FETCH_MAILS_SUCCESS = 'FETCH_MAILS_SUCCESS',
  FETCH_MAILS_ERROR = 'FETCH_MAILS_ERROR',
}

interface FetchMailsAction {
  type: MailsActionTypes.FETCH_MAILS;
  payload: any;
}

export type MailsAction = FetchMailsAction;
