import { useAccount } from '@gear-js/react-hooks';

import { ReactNode, createContext, useContext, useEffect } from 'react';

import { useGaslessTransactions } from '@/features/gasless-transactions';
import { useSignlessTransactions } from '@/features/signless-transactions';

import { DEFAULT_VALUES } from './consts';
import { Value } from './types';

const TransactionsContext = createContext<Value>(DEFAULT_VALUES);
const { Provider } = TransactionsContext;

type Props = {
  children: ReactNode;
};

function EzTransactionsProvider({ children }: Props) {
  const { account } = useAccount();

  const gasless = useGaslessTransactions();

  const signlessContext = useSignlessTransactions();

  const onSessionCreate = async (signlessAccountAddress: string) => gasless.requestVoucher(signlessAccountAddress);

  const signless = {
    ...signlessContext,
    onSessionCreate,
  };

  useEffect(() => {
    if (signlessContext.isActive) return;

    gasless.setIsEnabled(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signlessContext.isActive]);

  useEffect(() => {
    if (!account || !signlessContext.voucher) return;

    const isOwner = account.decodedAddress === signlessContext.voucher.owner;
    if (isOwner) return;

    gasless.setIsEnabled(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, signlessContext.voucher]);

  return <Provider value={{ gasless, signless }}>{children}</Provider>;
}

const useEzTransactions = () => useContext(TransactionsContext);

export { EzTransactionsProvider, useEzTransactions };
