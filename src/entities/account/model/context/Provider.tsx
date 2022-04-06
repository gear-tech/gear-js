import { useState, ReactNode } from 'react';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import AccountContext from './Context';

type Props = {
  children: ReactNode;
};

const { Provider } = AccountContext;

const useAccount = () => {
  const [account, setAccount] = useState<InjectedAccountWithMeta>();

  return { account, setAccount };
};

function AccountProvider({ children }: Props) {
  return <Provider value={useAccount()}>{children}</Provider>;
}

export default AccountProvider;
