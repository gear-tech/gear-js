import { createContext } from 'react';

type Value = {
  isDevChain: boolean | undefined;
  isChainRequestReady: boolean;
};

const ChainContext = createContext<Value>({ isDevChain: undefined, isChainRequestReady: false });

export { ChainContext };
