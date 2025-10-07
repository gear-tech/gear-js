import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { createContext, useContext } from 'react';

export type AccountListContextValue = {
  accounts: InjectedAccountWithMeta[];
};

const AccountsListContext = createContext<AccountListContextValue | undefined>(undefined);

const { Provider: AccountsListProvider } = AccountsListContext;

export function useAccountsListContext() {
  const context = useContext(AccountsListContext);

  if (!context) {
    throw new Error('Accounts list context is missing. Place parts inside <Wallet.AccountsList>.');
  }

  return context;
}

export { AccountsListProvider };
