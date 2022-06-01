import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Balance } from '@polkadot/types/interfaces';
import { useState, createContext, useContext } from 'react';
import { Account, ProviderProps } from 'types';
import { LOCAL_STORAGE } from 'consts';
import { ApiContext } from './Api';
import { getBalance, getAccount } from 'utils';

type Value = {
  account: Account | undefined;
  switchAccount: (account: InjectedAccountWithMeta) => void;
  updateBalance: (balance: Balance) => void;
  logout: () => void;
};

const AccountContext = createContext({} as Value);

function AccountProvider({ children }: ProviderProps) {
  const { api } = useContext(ApiContext); // сircular dependency fix

  const [account, setAccount] = useState<Account>();

  const login = (_account: Account) => {
    localStorage.setItem(LOCAL_STORAGE.ACCOUNT, _account.address);
    setAccount(_account);
  };

  const switchAccount = (_account: InjectedAccountWithMeta) => {
    api?.balance
      .findOut(_account.address)
      .then((balance) => getAccount(_account, balance))
      .then(login);
  };

  const updateBalance = (balance: Balance) => {
    setAccount((prevAccount) => (prevAccount ? { ...prevAccount, balance: getBalance(balance) } : prevAccount));
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE.ACCOUNT);
    setAccount(undefined);
  };

  const { Provider } = AccountContext;
  const value = { account, switchAccount, updateBalance, logout };

  return <Provider value={value}>{children}</Provider>;
}

export { AccountContext, AccountProvider };
