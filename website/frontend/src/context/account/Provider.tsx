import { useEffect, useState } from 'react';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { AccountContext } from './Context';
import { Props } from '../types';

const { Provider } = AccountContext;

const useAccount = () => {
  const [account, setAccount] = useState<InjectedAccountWithMeta>();

  return { account, setAccount };
};

const AccountProvider = ({ children }: Props) => <Provider value={useAccount()}>{children}</Provider>;

export { AccountProvider };
