import type { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import { Balance } from '@polkadot/types/interfaces';
import { web3Accounts, web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp';
import { formatBalance } from '@polkadot/util';
import { GearApi, decodeAddress } from '@gear-js/api';
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

  const getBalance = (_api: GearApi, balance: Balance) => {
    const [unit] = _api.registry.chainTokens;
    const [decimals] = _api.registry.chainDecimals;

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
    isApiReady
      ? api.balance
          .findOut(acc.address)
          .then((balance) => ({
            ...acc,
            balance: getBalance(api, balance),
            decodedAddress: decodeAddress(acc.address),
          }))
          .then((result) => switchAccount(result))
          .catch(handleError)
      : Promise.reject('API is not initialized');

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

    const loggedInAccount = accounts.find(isLoggedIn);

    web3AccountsSubscribe((accs) => setAccounts(accs));

    if (loggedInAccount) {
      login(loggedInAccount).finally(() => setIsAccountReady(true));
    } else setIsAccountReady(true);
  }, [isWeb3Enabled]);

  const updateBalance = (_api: GearApi, balance: Balance) =>
    setAccount((prevAccount) => (prevAccount ? { ...prevAccount, balance: getBalance(_api, balance) } : prevAccount));

  useEffect(() => {
    if (!isApiReady || !address) return;

    const unsub = api.gearEvents.subscribeToBalanceChanges(address, (balance) => updateBalance(api, balance));

    return () => {
      unsub.then((unsubCallback) => unsubCallback());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, api, address]);

  const { Provider } = AccountContext;
  const value = { extensions, accounts, account, isAccountReady, login, logout };

  return <Provider value={value}>{children}</Provider>;
}

export { AccountContext, AccountProvider };
export type { Value };
