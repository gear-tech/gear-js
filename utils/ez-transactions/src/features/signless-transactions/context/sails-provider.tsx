import { HexString } from '@gear-js/api';
import { ReactNode } from 'react';

import { useCreateSailsSession } from '../hooks';
import { usePair, useSailsSession } from './hooks';
import { SignlessTransactionsContext } from './context';
import { BaseProgram } from './types';

type SignlessTransactionsSailsProviderProps<TProgram extends BaseProgram> = {
  programId: HexString;
  children: ReactNode;
  program: TProgram;
};

function SignlessTransactionsSailsProvider<TProgram extends BaseProgram>({
  programId,
  children,
  program,
}: SignlessTransactionsSailsProviderProps<TProgram>) {
  const { session, isSessionReady, isSessionActive } = useSailsSession(program);
  const { createSession, deleteSession } = useCreateSailsSession(programId, program);
  const pairData = usePair(programId, session);
  const value = {
    ...pairData,
    session,
    isSessionReady,
    createSession,
    deleteSession,
    isSessionActive,
  };

  return <SignlessTransactionsContext.Provider value={value}>{children}</SignlessTransactionsContext.Provider>;
}

export { SignlessTransactionsSailsProvider };
export type { SignlessTransactionsSailsProviderProps };
