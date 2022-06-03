import { useEffect, useState } from 'react';
import type { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { useApi } from 'hooks';

function useAccounts() {
  const { isApiReady } = useApi();
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>();

  const getAccounts = (extensions: InjectedExtension[]) => (extensions.length > 0 ? web3Accounts() : undefined);

  useEffect(() => {
    if (isApiReady) {
      web3Enable('Gear App').then(getAccounts).then(setAccounts);
    }
  }, [isApiReady]);

  return accounts;
}

export { useAccounts };
