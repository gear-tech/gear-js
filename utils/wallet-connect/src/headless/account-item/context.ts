import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { createContext, useContext } from 'react';

export type AccountItemContextValue = {
  account: InjectedAccountWithMeta;
  isActive: boolean;
  onClick: () => void;
};

const AccountItemContext = createContext<AccountItemContextValue | undefined>(undefined);
const AccountItemProvider = AccountItemContext.Provider;

export function useAccountItemContext() {
  const context = useContext(AccountItemContext);

  if (!context) throw new Error('Account item context is missing. Place parts inside <Wallet.AccountItem>.');

  return context;
}

export { AccountItemProvider };
