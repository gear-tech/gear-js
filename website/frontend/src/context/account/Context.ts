import { createContext, Dispatch, SetStateAction } from 'react';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

type Value = {
  account: InjectedAccountWithMeta | undefined;
  setAccount: Dispatch<SetStateAction<InjectedAccountWithMeta | undefined>>;
};

const AccountContext = createContext({} as Value);

export { AccountContext };
