import { useQuery } from '@tanstack/react-query';
import { WsVaraEthProvider, createVaraEthApi } from '@vara-eth/api';
import { DynamicSigner, walletClientToSigner } from '@vara-eth/api/signer';
import { useEffect, useRef } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';

import { ROUTER_CONTRACT_ADDRESS, VARA_ETH_NODE_ADDRESS } from '@/shared/config';

export function useVaraEthApi() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const walletClientRef = useRef(walletClient);
  walletClientRef.current = walletClient;

  const query = useQuery({
    queryKey: ['varaEthApi', publicClient?.uid],

    queryFn: async () => {
      const signer = new DynamicSigner(() =>
        walletClientRef.current ? walletClientToSigner(walletClientRef.current) : undefined,
      );

      const provider = new WsVaraEthProvider(VARA_ETH_NODE_ADDRESS);
      const api = await createVaraEthApi(provider, publicClient!, ROUTER_CONTRACT_ADDRESS, signer);

      return { api, provider };
    },

    enabled: Boolean(publicClient),
  });

  useEffect(() => {
    if (!query.data) return;

    const { provider } = query.data;

    return () => {
      provider.disconnect().catch((error) => console.error(error));
    };
  }, [query.data]);

  const { data } = query;

  return {
    api: data?.api,
    isApiReady: Boolean(data?.api),
  };
}
