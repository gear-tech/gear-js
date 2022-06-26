import { useCallback, useMemo, useState } from 'react';
import { Balance } from '@polkadot/types/interfaces';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { getAccount, getBalance } from './helpers';
import { AccountContext } from './Context';
import { Props, Account } from '../types';

import { useApi } from 'hooks';

function AccountProvider({ children }: Props) {
  const { api } = useApi();

  const [account, setAccount] = useState<Account>();

  const switchAccount = useCallback(
    (_account: InjectedAccountWithMeta) => {
      api?.balance
        .findOut(_account.address)
        .then((balance: Balance) => getAccount(_account, balance))
        .then(setAccount);
    },
    [api]
  );

  const updateBalance = useCallback((balance: Balance) => {
    const newBalance = getBalance(balance);

    setAccount((prevAccount) => {
      const prevBalance = prevAccount?.balance;
      const isBalanceChanged = newBalance.unit !== prevBalance?.unit || newBalance.value !== prevBalance.value;

      if (prevAccount && isBalanceChanged) {
        return {
          ...prevAccount,
          balance: newBalance,
        };
      }

      return prevAccount;
    });
  }, []);

  const logout = useCallback(() => setAccount(undefined), []);

  const value = useMemo(
    () => ({ account, switchAccount, updateBalance, logout }),
    [account, switchAccount, updateBalance, logout]
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export { AccountProvider };
