import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { getRouterContract } from 'gearexe';
import { useAccount } from 'wagmi';

import { ETH_NODE_ADDRESS, ROUTER_CONTRACT_ADDRESS } from '@/shared/config';

import { useEthersSigner } from './ethers/signer';

const useRouterContract = () => {
  const ethAccount = useAccount();
  const signer = useEthersSigner({ chainId: ethAccount.chain?.id });

  const { data: routerContract, isLoading } = useQuery({
    queryKey: ['getRouterContract', signer],
    // queryFn: () => getRouterContract(ROUTER_CONTRACT_ADDRESS, signer),
    // TODO: Temporary solution. MetaMask doesn't support blob transactions. Used for testing.
    queryFn: () =>
      getRouterContract(
        ROUTER_CONTRACT_ADDRESS,
        new ethers.Wallet(
          import.meta.env.VITE_SEQUENCER_PRIVATE_KEY as string,
          new ethers.WebSocketProvider(ETH_NODE_ADDRESS),
        ),
      ),
    enabled: Boolean(signer),
  });

  return { routerContract, isLoading };
};

export { useRouterContract };
