import { Unsubcall } from '@polkadot/extension-inject/types';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { ProviderProps } from '../../types';
import { LOCAL_STORAGE_KEY, DEFAULT_INJECT_TIMEOUT_MS } from './consts';
import { Account, Wallet, Wallets } from './types';
import { getLoggedInAccount, getWallets } from './utils';

type Value = {
  wallets: Wallets | undefined;
  account: Account | undefined;
  isAnyWallet: boolean;
  isAccountReady: boolean;
  login: (account: Account) => void;
  logout: () => void;
};

const DEFAULT_VALUE = {
  wallets: undefined,
  account: undefined,
  isAnyWallet: false,
  isAccountReady: false,
  login: () => {},
  logout: () => {},
} as const;

const AccountContext = createContext<Value>(DEFAULT_VALUE);
const { Provider } = AccountContext;
const useAccount = () => useContext(AccountContext);

type Props = ProviderProps & {
  appName: string;
};

function AccountProvider({ appName, children }: Props) {
  const [wallets, setWallets] = useState<Wallets>();
  const [account, setAccount] = useState<Account>();
  const unsubsRef = useRef<Unsubcall[]>([]);

  const isAnyWallet = Object.keys(wallets || {}).length > 0;
  const isAccountReady = Boolean(wallets);

  const login = (_account: Account) => {
    setAccount(_account);
    localStorage.setItem(LOCAL_STORAGE_KEY.ACCOUNT_ADDRESS, _account.address);
  };

  const logout = () => {
    setAccount(undefined);
    localStorage.removeItem(LOCAL_STORAGE_KEY.ACCOUNT_ADDRESS);
  };

  const handleAccountsChange = (id: string, accounts: Account[]) => {
    setWallets((prevWallets) =>
      prevWallets ? { ...prevWallets, [id]: { ...prevWallets[id], accounts } } : prevWallets,
    );

    setAccount((prevAccount) => {
      if (!prevAccount || id !== prevAccount.meta.source) return prevAccount;

      const isLoggedIn = Boolean(accounts.length) && accounts.some(({ address }) => address === prevAccount.address);

      if (isLoggedIn) return prevAccount;
    });
  };

  const handleWalletChange = (id: string, wallet: Wallet) =>
    setWallets((prevWallets) => (prevWallets ? { ...prevWallets, [id]: wallet } : prevWallets));

  const registerUnsub = (unsub: Unsubcall) => unsubsRef.current.push(unsub);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getWallets(appName, handleAccountsChange, handleWalletChange, registerUnsub).then((result) => {
        setWallets(result);
        setAccount(getLoggedInAccount(result));
      });
    }, DEFAULT_INJECT_TIMEOUT_MS);

    return () => {
      clearTimeout(timeoutId);

      unsubsRef.current.forEach((unsub) => unsub());
      unsubsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ wallets, account, isAnyWallet, isAccountReady, login, logout }),
    [wallets, account, isAnyWallet, isAccountReady],
  );

  return <Provider value={value}>{children}</Provider>;
}

export { AccountProvider, useAccount };
