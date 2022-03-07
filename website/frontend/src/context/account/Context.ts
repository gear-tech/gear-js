import { createContext, Dispatch, SetStateAction } from 'react';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

type Account = InjectedAccountWithMeta | undefined;

type Value = {
  account: Account;
  setAccount: Dispatch<SetStateAction<Account>>;
};

const AccountContext = createContext({} as Value);

export { AccountContext };
