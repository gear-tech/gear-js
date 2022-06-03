import { createContext } from 'react';
import type { Account } from '../types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Balance } from '@polkadot/types/interfaces';

type Value = {
  account: Account | undefined;
  switchAccount: (account: InjectedAccountWithMeta) => void;
  updateBalance: (balance: Balance) => void;
  logout: () => void;
};

const AccountContext = createContext({} as Value);

export { AccountContext };
