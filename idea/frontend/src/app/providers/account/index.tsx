import { Account, ProviderProps } from '@gear-js/react-hooks';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { LOCAL_STORAGE_KEY, DEFAULT_INJECT_TIMEOUT_MS } from './consts';
import { Wallet, Wallets } from './types';
import { getLoggedInAccount, getWallets } from './utils';

type Value = {
  wallets: Wallets | undefined;
  account: Account | undefined;
  login: (account: Account) => void;
  logout: () => void;
};

const DEFAULT_VALUE = {
  wallets: undefined,
  account: undefined,
  login: () => {},
  logout: () => {},
} as const;

const AccountContext = createContext<Value>(DEFAULT_VALUE);
const { Provider } = AccountContext;

const useAccount = () => useContext(AccountContext);

type Props = ProviderProps & {
  appName?: string;
};

function AccountProvider({ appName = 'Gear dApp', children }: Props) {
  const [wallets, setWallets] = useState<Wallets>();
  const [account, setAccount] = useState<Account>();

  const login = (_account: Account) => {
    setAccount(_account);
    localStorage.setItem(LOCAL_STORAGE_KEY.ACCOUNT_ADDRESS, _account.address);
  };

  const logout = () => {
    setAccount(undefined);
    localStorage.removeItem(LOCAL_STORAGE_KEY.ACCOUNT_ADDRESS);
  };

  const handleAccountsChange = (id: string, accounts: Account[]) =>
    setWallets((prevWallets) =>
      prevWallets ? { ...prevWallets, [id]: { ...prevWallets[id], accounts } } : prevWallets,
    );

  const handleWalletChange = (id: string, wallet: Wallet) =>
    setWallets((prevWallets) => (prevWallets ? { ...prevWallets, [id]: wallet } : prevWallets));

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // TODO: unsubs
      // TODO: what if logged in account will be removed?
      getWallets(appName, handleAccountsChange, handleWalletChange).then((result) => {
        setWallets(result);
        setAccount(getLoggedInAccount(result));
      });
    }, DEFAULT_INJECT_TIMEOUT_MS);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({ wallets, account, login, logout }), [wallets, account]);

  return <Provider value={value}>{children}</Provider>;
}

export { AccountProvider as NewAccountProvider, useAccount as useNewAccount };
