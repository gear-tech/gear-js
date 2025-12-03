import { EthereumClient } from '@vara-eth/api';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { type WebSocketTransport } from 'viem';
import { usePublicClient, useWalletClient } from 'wagmi';

import { ETH_CHAIN_ID, ROUTER_CONTRACT_ADDRESS } from '@/shared/config';

import { EthereumClientContext } from './context';

function EthereumClientProvider({ children }: PropsWithChildren) {
  const { data: walletClient } = useWalletClient({ chainId: ETH_CHAIN_ID });
  const publicClient = usePublicClient({ chainId: ETH_CHAIN_ID });
  const [client, setClient] = useState<EthereumClient<WebSocketTransport> | null>(null);

  useEffect(() => {
    if (!walletClient || !publicClient) {
      setClient(null);
      return;
    }

    const instance = new EthereumClient<WebSocketTransport>(publicClient, walletClient, ROUTER_CONTRACT_ADDRESS);
    let cancelled = false;

    void instance.isInitialized.then((isInitialized) => {
      if (!cancelled && isInitialized) {
        setClient(instance);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [walletClient, publicClient]);

  const value = useMemo(
    () => ({
      ethereumClient: client,
      isReady: client !== null,
    }),
    [client],
  );

  return <EthereumClientContext.Provider value={value}>{children}</EthereumClientContext.Provider>;
}

export { EthereumClientProvider };
