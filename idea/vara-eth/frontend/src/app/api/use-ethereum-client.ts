import { useQuery } from '@tanstack/react-query';
import { EthereumClient } from '@vara-eth/api';
import { type WebSocketTransport } from 'viem';
import { usePublicClient, useWalletClient } from 'wagmi';

import { ROUTER_CONTRACT_ADDRESS } from '@/shared/config';

export function useEthereumClient() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['ethereumClient', walletClient, publicClient],
    queryFn: async (): Promise<EthereumClient<WebSocketTransport> | null> => {
      const instance = new EthereumClient<WebSocketTransport>(publicClient!, walletClient!, ROUTER_CONTRACT_ADDRESS);
      const isInitialized = await instance.isInitialized;

      if (!isInitialized) throw new Error('EthereumClient initialization failed');

      return instance;
    },
    enabled: Boolean(walletClient && publicClient),
  });
}
