import { useContext, ReactElement } from 'react';

import { DEFAULT_SIGNLESS_CONTEXT } from './consts';
import { SignlessTransactionsContext } from './context';
import { BaseProgram, SignlessContext } from './types';
import { SignlessTransactionsMetadataProvider, SignlessTransactionsMetadataProviderProps } from './metadata-provider';
import { SignlessTransactionsSailsProvider, SignlessTransactionsSailsProviderProps } from './sails-provider';

function SignlessTransactionsProvider(props: SignlessTransactionsMetadataProviderProps): ReactElement;
function SignlessTransactionsProvider<TProgram extends BaseProgram>(
  props: SignlessTransactionsSailsProviderProps<TProgram>,
): ReactElement;

function SignlessTransactionsProvider<TProgram extends BaseProgram>(
  props: SignlessTransactionsMetadataProviderProps | SignlessTransactionsSailsProviderProps<TProgram>,
) {
  if ('metadataSource' in props) {
    return SignlessTransactionsMetadataProvider(props);
  } else if ('program' in props) {
    return <SignlessTransactionsSailsProvider {...props} />;
  } else {
    throw new Error('Invalid SignlessTransactionsProvider props');
  }
}

const useSignlessTransactions = () => useContext(SignlessTransactionsContext);

export { SignlessTransactionsProvider, useSignlessTransactions, DEFAULT_SIGNLESS_CONTEXT };
export type { SignlessContext, SignlessTransactionsMetadataProviderProps, SignlessTransactionsSailsProviderProps };
