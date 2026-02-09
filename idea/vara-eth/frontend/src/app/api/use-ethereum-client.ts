import { useQuery } from '@tanstack/react-query';
import { EthereumClient } from '@vara-eth/api';
import { walletClientToSigner } from '@vara-eth/api/signer';
import { usePublicClient, useWalletClient } from 'wagmi';

import { ROUTER_CONTRACT_ADDRESS } from '@/shared/config';

export function useEthereumClient() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  return useQuery({
    queryKey: ['ethereumClient', publicClient?.uid, walletClient?.uid],

    queryFn: async () => {
      const instance = new EthereumClient(
        publicClient!,
        ROUTER_CONTRACT_ADDRESS,
        walletClient ? walletClientToSigner(walletClient) : undefined,
      );

      const isInitialized = await instance.waitForInitialization();

      if (!isInitialized) throw new Error('EthereumClient initialization failed');

      return instance;
    },

    enabled: Boolean(publicClient),
  });
}
