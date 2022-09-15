import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Balance } from '@polkadot/types/interfaces';
import { web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp';
import { UnsubscribePromise } from '@polkadot/api/types';
import { useState, createContext, useContext, useEffect } from 'react';
import { Account, ProviderProps } from 'types';
import { LOCAL_STORAGE } from 'consts';
import { getBalance, getAccount, isLoggedIn } from 'utils';
import { ApiContext } from './Api';
import { AlertContext } from './Alert';

type Value = {
  account: Account | undefined;
  accounts: InjectedAccountWithMeta[] | undefined;
  switchAccount: (account: InjectedAccountWithMeta) => Promise<string | void>;
  updateBalance: (balance: Balance) => void;
  logout: () => void;
  isAccountReady: boolean;
};

const AccountContext = createContext({} as Value);

function AccountProvider({ children }: ProviderProps) {
  const { api, isApiReady } = useContext(ApiContext); // сircular dependency fix
  const alert = useContext(AlertContext);

  const [account, setAccount] = useState<Account>();
  const { address } = account || {};

  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>();

  const [isExtensionReady, setIsExtensionReady] = useState(false);
  const [isAccountReady, setIsAccountReady] = useState(false);

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

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE.ACCOUNT);
    setAccount(undefined);
  };

  useEffect(() => {
    if (isApiReady)
      web3Enable('Gear App')
        .then(() => web3AccountsSubscribe(setAccounts))
        .catch(handleError)
        .finally(() => setIsExtensionReady(true));
  }, [isApiReady]);

  useEffect(() => {
    if (isExtensionReady) {
      const loggedInAccount = accounts?.find(isLoggedIn);

      if (loggedInAccount) {
        switchAccount(loggedInAccount).finally(() => setIsAccountReady(true));
      } else setIsAccountReady(true);
    }
  }, [isExtensionReady]);

  const updateBalance = (balance: Balance) =>
    setAccount((prevAccount) => (prevAccount ? { ...prevAccount, balance: getBalance(balance) } : prevAccount));

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (address) {
      unsub = api?.gearEvents.subscribeToBalanceChange(address, updateBalance);
    }

    return () => {
      if (unsub) unsub.then((callback) => callback());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, address]);

  const { Provider } = AccountContext;
  const value = { account, accounts, switchAccount, updateBalance, logout, isAccountReady };

  return <Provider value={value}>{children}</Provider>;
}

export { AccountContext, AccountProvider };
