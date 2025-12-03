import { useContext } from 'react';

import { EthereumClientContext } from './context';

export function useEthereumClient() {
  const { ethereumClient } = useContext(EthereumClientContext);

  return ethereumClient;
}
