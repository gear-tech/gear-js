import { createContext, useContext } from 'react';

type BalanceContextValue = {
  value: string;
  unit: string;
};

const BalanceContext = createContext<BalanceContextValue | undefined>(undefined);
const BalanceProvider = BalanceContext.Provider;

function useBalanceContext() {
  const context = useContext(BalanceContext);

  if (!context) throw new Error('Balance context is missing. Place balance parts inside <Wallet.Balance>.');

  return context;
}

export { BalanceProvider, useBalanceContext };
