import { useQuery } from '@tanstack/react-query';
import { getRouterClient } from '@vara-eth/api';
import { useAccount } from 'wagmi';

import { ROUTER_CONTRACT_ADDRESS } from '@/shared/config';

import { useEthereumClient } from './use-ethereum-client';

const useRouterContract = () => {
  const ethAccount = useAccount();
  const ethereumClient = useEthereumClient({ chainId: ethAccount.chain?.id });

  const { data: routerContract, isLoading } = useQuery({
    queryKey: ['getRouterClient', ethereumClient],
    queryFn: () => getRouterClient(ROUTER_CONTRACT_ADDRESS, ethereumClient!),
    enabled: Boolean(ethereumClient),
  });

  return { routerContract, isLoading };
};

export { useRouterContract };
