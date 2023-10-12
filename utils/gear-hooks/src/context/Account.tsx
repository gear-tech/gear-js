import type { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import { web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp';
import { decodeAddress } from '@gear-js/api';
import { useState, createContext, useContext, useEffect, useMemo } from 'react';
import { LOCAL_STORAGE } from 'consts';
import { Account, ProviderProps } from '../types';
import { AlertContext } from './Alert';

type Value = {
  extensions: InjectedExtension[] | undefined;
  accounts: InjectedAccountWithMeta[] | undefined;
  account: Account | undefined;
  isAccountReady: boolean;
  login: (account: InjectedAccountWithMeta) => void;
  logout: () => void;
};

const initialValue = {
  extensions: undefined,
  accounts: undefined,
  account: undefined,
  isAccountReady: false,
  login: () => {},
  logout: () => {},
};

const AccountContext = createContext<Value>(initialValue);
const { Provider } = AccountContext;

function AccountProvider({ children }: ProviderProps) {
  const alert = useContext(AlertContext);

  const [extensions, setExtensions] = useState<InjectedExtension[]>();
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>();
  const [account, setAccount] = useState<InjectedAccountWithMeta>();
  const [isAccountReady, setIsAccountReady] = useState(false);

  const login = (_account: InjectedAccountWithMeta) => {
    setAccount(_account);
    localStorage.setItem(LOCAL_STORAGE.ACCOUNT, _account.address);
  };

  const logout = () => {
    setAccount(undefined);
    localStorage.removeItem(LOCAL_STORAGE.ACCOUNT);
  };

  useEffect(() => {
    web3Enable('Gear App')
      .then((result) => setExtensions(result))
      .catch(({ message }: Error) => alert.error(message));
  }, []);

  useEffect(() => {
    if (extensions === undefined) return;

    const unsub = web3AccountsSubscribe((result) => setAccounts(result));

    return () => {
      unsub.then((unsubCallback) => unsubCallback());
    };
  }, [extensions]);

  useEffect(() => {
    if (accounts === undefined) return;

    const loggedInAccount = accounts.find(({ address }) => localStorage[LOCAL_STORAGE.ACCOUNT] === address);

    setAccount(loggedInAccount);
    setIsAccountReady(true);
  }, [accounts]);

  const value = useMemo(
    () => ({
      extensions,
      accounts,
      account: account ? { ...account, decodedAddress: decodeAddress(account.address) } : undefined,
      isAccountReady,
      login,
      logout,
    }),
    [extensions, accounts, account, isAccountReady],
  );

  return <Provider value={value}>{children}</Provider>;
}

export { AccountContext, AccountProvider };
