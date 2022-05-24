import { useState, createContext } from 'react';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useApi } from 'hooks';
import { Account } from 'types';
import { GearKeyring } from '@gear-js/api';
import { Balance } from '@polkadot/types/interfaces';
import { Props } from './types';

type Value = {
  account: Account | undefined;
  switchAccount: (account: InjectedAccountWithMeta) => void;
  updateBalance: (balance: Balance) => void;
  logout: () => void;
};

const AccountContext = createContext({} as Value);

function AccountProvider({ children }: Props) {
  const { api } = useApi();

  const [account, setAccount] = useState<Account>();

  const getBalance = (balance: Balance) => {
    const [value, unit] = balance.toHuman().split(' ');
    return { value, unit };
  };

  const getAccount = (_account: InjectedAccountWithMeta, balance: Balance) => ({
    ..._account,
    balance: getBalance(balance),
    decodedAddress: GearKeyring.decodeAddress(_account.address),
  });

  const switchAccount = (_account: InjectedAccountWithMeta) => {
    api?.balance
      .findOut(_account.address)
      .then((balance) => getAccount(_account, balance))
      .then(setAccount);
  };

  const updateBalance = (balance: Balance) => {
    setAccount((prevAccount) => (prevAccount ? { ...prevAccount, balance: getBalance(balance) } : prevAccount));
  };

  const logout = () => {
    setAccount(undefined);
  };

  const { Provider } = AccountContext;
  const value = { account, switchAccount, updateBalance, logout };

  return <Provider value={value}>{children}</Provider>;
}

export { AccountContext, AccountProvider };
