import { ProviderProps, useApi } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

import { getIsTestBalanceAvailable } from '@/features/balance';
import { GENESIS } from '@/shared/config';

import { ChainContext } from './Context';

const { Provider } = ChainContext;

const ChainProvider = ({ children }: ProviderProps) => {
  const { api } = useApi();
  const genesis = api?.genesisHash.toHex();
  const isDevChain = genesis ? genesis !== GENESIS.MAINNET && genesis !== GENESIS.TESTNET : undefined;

  const [isTestBalanceAvailable, setIsTestBalanceAvailable] = useState<boolean>();
  const isChainRequestReady = isDevChain !== undefined && isTestBalanceAvailable !== undefined;

  useEffect(() => {
    setIsTestBalanceAvailable(undefined);

    if (isDevChain === undefined) return;

    if (isDevChain) {
      setIsTestBalanceAvailable(true);
    } else {
      getIsTestBalanceAvailable(genesis!).then(({ result }) => setIsTestBalanceAvailable(result));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDevChain]);

  return <Provider value={{ isDevChain, isTestBalanceAvailable, isChainRequestReady }}>{children}</Provider>;
};

export { ChainProvider };
