import { useEffect, useState } from 'react';
import type { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { useAccount, useApi } from './context';

function useAccounts() {
  const { isApiReady } = useApi();
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>();

  const getAccounts = (extensions: InjectedExtension[]) => (extensions.length > 0 ? web3Accounts() : undefined);

  useEffect(() => {
    if (isApiReady) web3Enable('Gear App').then(getAccounts).then(setAccounts);
  }, [isApiReady]);

  return accounts;
}

function useLoggedInAccount() {
  const { api } = useApi();
  const { switchAccount } = useAccount();
  const accounts = useAccounts();

  const isLoggedIn = ({ address }: InjectedAccountWithMeta) => localStorage.account === address;

  useEffect(() => {
    const loggedInAccount = accounts?.find(isLoggedIn);
    if (loggedInAccount) switchAccount(loggedInAccount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, accounts]);
}

export { useAccounts, useLoggedInAccount };
