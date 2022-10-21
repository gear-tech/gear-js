import { createContext } from 'react';

type Value = {
  isDevChain: boolean | undefined;
  isTestBalanceAvailable: boolean | undefined;
  isChainRequestReady: boolean;
};

const ChainContext = createContext<Value>({
  isDevChain: undefined,
  isTestBalanceAvailable: undefined,
  isChainRequestReady: false,
});

export { ChainContext };
