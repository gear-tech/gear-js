import { useState, ReactNode, createContext, Dispatch, SetStateAction } from 'react';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

type Value = {
  account: InjectedAccountWithMeta | undefined;
  setAccount: Dispatch<SetStateAction<InjectedAccountWithMeta | undefined>>;
};

type Props = {
  children: ReactNode;
};

const AccountContext = createContext({} as Value);

function AccountProvider({ children }: Props) {
  const [account, setAccount] = useState<InjectedAccountWithMeta>();

  const { Provider } = AccountContext;
  const value = { account, setAccount };

  return <Provider value={value}>{children}</Provider>;
}

export { AccountContext, AccountProvider };
