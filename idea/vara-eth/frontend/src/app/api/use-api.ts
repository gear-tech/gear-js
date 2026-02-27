import { useQuery } from '@tanstack/react-query';
import { WsVaraEthProvider, createVaraEthApi } from '@vara-eth/api';
import { useEffect } from 'react';
import { usePublicClient } from 'wagmi';

import { ROUTER_CONTRACT_ADDRESS, VARA_ETH_NODE_ADDRESS } from '@/shared/config';

import { useSigner } from './use-signer';

function useApi() {
  const publicClient = usePublicClient();
  const signer = useSigner();

  return useQuery({
    queryKey: ['varaEthApi', publicClient?.uid],

    queryFn: () =>
      createVaraEthApi(new WsVaraEthProvider(VARA_ETH_NODE_ADDRESS), publicClient!, ROUTER_CONTRACT_ADDRESS, signer),

    enabled: Boolean(publicClient),
  });
}

function useApiCleanup() {
  const { data: api } = useApi();

  useEffect(
    () => () => {
      api?.provider.disconnect().catch((error) => console.error(error));
    },
    [api],
  );
}

export { useApi, useApiCleanup };
