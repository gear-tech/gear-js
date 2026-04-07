import { useQuery } from '@tanstack/react-query';
import { createVaraEthApi, WsVaraEthProvider } from '@vara-eth/api';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { usePublicClient } from 'wagmi';

import { nodeAtom } from '@/app/store/node';

import { useSigner } from './use-signer';

function useApi() {
  const publicClient = usePublicClient();
  const signer = useSigner();
  const { varaEthNodeAddress, routerContractAddress, ethChainId } = useAtomValue(nodeAtom);

  return useQuery({
    queryKey: ['varaEthApi', publicClient?.uid, varaEthNodeAddress, routerContractAddress, ethChainId],

    queryFn: () =>
      createVaraEthApi(new WsVaraEthProvider(varaEthNodeAddress), publicClient!, routerContractAddress, signer),

    enabled: Boolean(publicClient) && publicClient?.chain.id === ethChainId,
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
