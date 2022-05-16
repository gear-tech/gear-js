import { useState, createContext, useEffect } from 'react';
import type { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import isLoggedIn from 'utils';
import { useApi } from 'hooks';
import { Account } from 'types';
import { GearKeyring } from '@gear-js/api';
import Props from './types';

type Value = {
  accounts: InjectedAccountWithMeta[] | undefined;
  account: Account | undefined;
  switchAccount: (account: InjectedAccountWithMeta) => void;
  logout: () => void;
};

const AccountContext = createContext({} as Value);

function AccountProvider({ children }: Props) {
  const { api } = useApi();

  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>();
  const [account, setAccount] = useState<Account>();

  const getAccounts = (extensions: InjectedExtension[]) => (extensions.length > 0 ? web3Accounts() : undefined);

  useEffect(() => {
    setTimeout(() => {
      web3Enable('Gear App').then(getAccounts).then(setAccounts);
    }, 300);
  }, []);

  const switchAccount = (acc: InjectedAccountWithMeta) => {
    const { address } = acc;

    api?.balance
      .findOut(address)
      .then((result) => ({
        ...acc,
        balance: result.toHuman(),
        decodedAddress: GearKeyring.decodeAddress(address),
      }))
      .then(setAccount);
  };

  const logout = () => {
    setAccount(undefined);
  };

  useEffect(() => {
    const loggedInAccount = accounts?.find(isLoggedIn);
    if (loggedInAccount) switchAccount(loggedInAccount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, accounts]);

  const { Provider } = AccountContext;
  const value = { accounts, account, switchAccount, logout };

  return <Provider value={value}>{children}</Provider>;
}

export { AccountContext, AccountProvider };
