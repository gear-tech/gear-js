import type { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import { Balance } from '@polkadot/types/interfaces';
import { web3Accounts, web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp';
import { UnsubscribePromise } from '@polkadot/api/types';
import { formatBalance } from '@polkadot/util';
import { decodeAddress } from '@gear-js/api';
import { useState, createContext, useContext, useEffect } from 'react';
import { LOCAL_STORAGE } from 'consts';
import { isLoggedIn } from 'utils';
import { Account, ProviderProps } from '../types';
import { ApiContext } from './Api';
import { AlertContext } from './Alert';

type Value = {
  extensions: InjectedExtension[];
  accounts: InjectedAccountWithMeta[];
  account: Account | undefined;
  isAccountReady: boolean;
  login: (account: InjectedAccountWithMeta) => Promise<string | void>;
  logout: () => void;
};

const AccountContext = createContext({} as Value);

function AccountProvider({ children }: ProviderProps) {
  const { api, isApiReady } = useContext(ApiContext); // сircular dependency fix
  const alert = useContext(AlertContext);

  const [extensions, setExtensions] = useState<InjectedExtension[]>([]);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);

  const [account, setAccount] = useState<Account>();
  const { address } = account || {};

  const [isWeb3Enabled, setIsWeb3Enabled] = useState(false);
  const [isAccountReady, setIsAccountReady] = useState(false);

  const handleError = ({ message }: Error) => alert.error(message);

  const getBalance = (balance: Balance) => {
    const [unit] = api.registry.chainTokens;
    const [decimals] = api.registry.chainDecimals;

    const value = formatBalance(balance.toString(), {
      decimals,
      forceUnit: unit,
      withSiFull: false,
      withSi: false,
      withUnit: unit,
    });

    return { value, unit };
  };

  const switchAccount = (acc: Account) => {
    localStorage.setItem(LOCAL_STORAGE.ACCOUNT, acc.address);
    setAccount(acc);
  };

  const login = (acc: InjectedAccountWithMeta) =>
    api?.balance
      .findOut(acc.address)
      .then((balance) => ({ ...acc, balance: getBalance(balance), decodedAddress: decodeAddress(acc.address) }))
      .then(switchAccount)
      .catch(handleError);

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE.ACCOUNT);
    setAccount(undefined);
  };

  useEffect(() => {
    if (isApiReady)
      web3Enable('Gear App')
        .then(async (result) => ({ exts: result, accs: await web3Accounts() }))
        .then(({ exts, accs }) => {
          setExtensions(exts);
          setAccounts(accs);
        })
        .catch(handleError)
        .finally(() => setIsWeb3Enabled(true));
  }, [isApiReady]);

  useEffect(() => {
    if (!isWeb3Enabled) return;

    const loggedInAccount = accounts?.find(isLoggedIn);
    let unsub: UnsubscribePromise | undefined;

    web3AccountsSubscribe((accs) => setAccounts(accs));

    if (loggedInAccount) {
      login(loggedInAccount).finally(() => setIsAccountReady(true));
    } else setIsAccountReady(true);

    return () => {
      unsub?.then((unsubCallback) => unsubCallback());
    };
  }, [isWeb3Enabled]);

  const updateBalance = (balance: Balance) =>
    setAccount((prevAccount) => (prevAccount ? { ...prevAccount, balance: getBalance(balance) } : prevAccount));

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (address) {
      unsub = api?.gearEvents.subscribeToBalanceChanges(address, updateBalance);
    }

    return () => {
      unsub?.then((callback) => callback());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, address]);

  const { Provider } = AccountContext;
  const value = { extensions, accounts, account, isAccountReady, login, logout };

  return <Provider value={value}>{children}</Provider>;
}

export { AccountContext, AccountProvider };
export type { Value };
