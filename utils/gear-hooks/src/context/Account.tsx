import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Balance } from '@polkadot/types/interfaces';
import { web3Enable } from '@polkadot/extension-dapp';
import { useState, createContext, useContext, useEffect } from 'react';
import { Account, ProviderProps } from 'types';
import { LOCAL_STORAGE } from 'consts';
import { getBalance, getAccount, getAccounts, isLoggedIn } from 'utils';
import { ApiContext } from './Api';
import { AlertContext } from './Alert';

type Value = {
  account: Account | undefined;
  accounts: InjectedAccountWithMeta[] | undefined;
  switchAccount: (account: InjectedAccountWithMeta) => Promise<string | void>;
  updateBalance: (balance: Balance) => void;
  logout: () => void;
  initAccounts: () => Promise<string | void>;
};

const AccountContext = createContext({} as Value);

function AccountProvider({ children }: ProviderProps) {
  const { api, isApiReady } = useContext(ApiContext); // сircular dependency fix
  const alert = useContext(AlertContext);

  const [account, setAccount] = useState<Account>();
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>();

  const login = (_account: Account) => {
    localStorage.setItem(LOCAL_STORAGE.ACCOUNT, _account.address);
    setAccount(_account);
  };

  const handleError = ({ message }: Error) => alert.error(message);

  const switchAccount = (_account: InjectedAccountWithMeta) =>
    api?.balance
      .findOut(_account.address)
      .then((balance) => getAccount(_account, balance))
      .then(login)
      .catch(handleError);

  const updateBalance = (balance: Balance) =>
    setAccount((prevAccount) => (prevAccount ? { ...prevAccount, balance: getBalance(balance) } : prevAccount));

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE.ACCOUNT);
    setAccount(undefined);
  };

  const initAccounts = () => web3Enable('Gear App').then(getAccounts).then(setAccounts).catch(handleError);
  // .finally(() => setIsExtensionReady(true));

  useEffect(() => {
    if (isApiReady) initAccounts();
  }, [isApiReady]);

  useEffect(() => {
    const loggedInAccount = accounts?.find(isLoggedIn);
    if (loggedInAccount) switchAccount(loggedInAccount);
  }, [accounts]);

  const { Provider } = AccountContext;
  const value = { account, accounts, switchAccount, updateBalance, logout, initAccounts };

  return <Provider value={value}>{children}</Provider>;
}

export { AccountContext, AccountProvider };
