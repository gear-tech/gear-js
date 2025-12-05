import { useQuery } from '@tanstack/react-query';
import { EthereumClient } from '@vara-eth/api';
import { type WebSocketTransport } from 'viem';
import { usePublicClient, useWalletClient } from 'wagmi';

import { ETH_CHAIN_ID, ROUTER_CONTRACT_ADDRESS } from '@/shared/config';

export function useEthereumClient() {
  const { data: walletClient } = useWalletClient({ chainId: ETH_CHAIN_ID });
  const publicClient = usePublicClient({ chainId: ETH_CHAIN_ID });

  return useQuery({
    queryKey: ['ethereumClient', ETH_CHAIN_ID, walletClient?.account?.address, publicClient?.chain?.id],
    queryFn: async (): Promise<EthereumClient<WebSocketTransport> | null> => {
      if (!walletClient || !publicClient) {
        return null;
      }

      const instance = new EthereumClient<WebSocketTransport>(publicClient, walletClient, ROUTER_CONTRACT_ADDRESS);
      const isInitialized = await instance.isInitialized;

      if (!isInitialized) {
        return null;
      }

      return instance;
    },
    enabled: Boolean(walletClient && publicClient),
  });
}
