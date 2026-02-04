import { useQuery } from '@tanstack/react-query';
import { EthereumClient } from '@vara-eth/api';
import { walletClientToSigner } from '@vara-eth/api/signer';
import { type WebSocketTransport } from 'viem';
import { usePublicClient, useWalletClient } from 'wagmi';

import { ROUTER_CONTRACT_ADDRESS } from '@/shared/config';

export function useEthereumClient() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['ethereumClient', walletClient, publicClient],
    queryFn: async () => {
      const instance = new EthereumClient<WebSocketTransport>(
        publicClient!,
        walletClientToSigner(walletClient!),
        ROUTER_CONTRACT_ADDRESS,
      );
      const isInitialized = await instance.waitForInitialization();

      if (!isInitialized) throw new Error('EthereumClient initialization failed');

      return instance;
    },
    enabled: Boolean(walletClient && publicClient),
  });
}
