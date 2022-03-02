import { createContext, useReducer, useContext } from 'react';
import { State, Dispatch } from './types';
import { reducer } from './reducer';

const MailBoxContext = createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

const MailBoxContextProvider = (props: any) => {
  const [state, dispatch] = useReducer(reducer, { mails: [] });

  return <MailBoxContext.Provider value={{ state, dispatch }}>{props.children}</MailBoxContext.Provider>;
};

const useMailBoxContext = () => {
  const context = useContext(MailBoxContext);

  if (context === undefined) {
    throw new Error('useMailBoxContext must be used within a MailBoxContextProvider');
  }

  return context;
};

export { MailBoxContextProvider, useMailBoxContext };
