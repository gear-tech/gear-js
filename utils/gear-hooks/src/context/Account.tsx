import { InjectedAccountWithMeta, InjectedExtension, Unsubcall } from '@polkadot/extension-inject/types';
import { web3Accounts, web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp';
import { decodeAddress } from '@gear-js/api';
import { useState, createContext, useEffect, useMemo } from 'react';
import { LOCAL_STORAGE, VARA_SS58_FORMAT } from 'consts';
import { Account, ProviderProps } from '../types';

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
  const [extensions, setExtensions] = useState<InjectedExtension[]>();
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>();
  const [account, setAccount] = useState<InjectedAccountWithMeta>();

  const isAccountReady = ![extensions, accounts].includes(undefined);

  const login = (_account: InjectedAccountWithMeta) => {
    setAccount(_account);
    localStorage.setItem(LOCAL_STORAGE.ACCOUNT, _account.address);
  };

  const logout = () => {
    setAccount(undefined);
    localStorage.removeItem(LOCAL_STORAGE.ACCOUNT);
  };

  useEffect(() => {
    const unsub = new Promise<Unsubcall>((resolve) => {
      // old issue - sometimes web3Enable executes earlier than extention (window.inejctedWeb3) is injected.
      // therefore we're creating 200ms delay, which seemed to be enough
      // e.g. https://github.com/polkadot-js/extension/issues/938
      setTimeout(async () => {
        const ss58Format = VARA_SS58_FORMAT;
        const _extensions = await web3Enable('Gear App');
        const _accounts = await web3Accounts({ ss58Format });

        const loggedInAccount = _accounts.find(({ address }) => localStorage[LOCAL_STORAGE.ACCOUNT] === address);

        setExtensions(_extensions);
        setAccounts(_accounts);
        setAccount(loggedInAccount);

        // promise with resolve to return unsub callback,
        // to safely subscribe in the same useEffect
        resolve(web3AccountsSubscribe((result) => setAccounts(result), { ss58Format }));
      }, 200);
    });

    return () => {
      unsub.then((unsubCallback) => unsubCallback());
    };
  }, []);

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
