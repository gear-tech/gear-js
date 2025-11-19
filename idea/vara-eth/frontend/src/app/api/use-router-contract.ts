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
    // TODO: Temporary solution. MetaMask doesn't support blob transactions. Used for testing.
    // queryFn: () =>
    //   getRouterClient(
    //     ROUTER_CONTRACT_ADDRESS,
    //     new ethers.Wallet(
    //       import.meta.env.VITE_SEQUENCER_PRIVATE_KEY as string,
    //       new ethers.WebSocketProvider(ETH_NODE_ADDRESS),
    //     ),
    //   ),
    enabled: Boolean(ethereumClient),
  });

  return { routerContract, isLoading };
};

export { useRouterContract };
