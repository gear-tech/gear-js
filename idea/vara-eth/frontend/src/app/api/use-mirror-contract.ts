import { useQuery } from '@tanstack/react-query';
import { getMirrorClient } from '@vara-eth/api';
import { useAccount } from 'wagmi';

import { MIRROR_CONTRACT_ADDRESS } from '@/shared/config';

import { useEthereumClient } from './use-ethereum-client';

const useMirrorContract = (mirrorAddress = MIRROR_CONTRACT_ADDRESS) => {
  const ethAccount = useAccount();
  const ethereumClient = useEthereumClient({ chainId: ethAccount.chain?.id });

  const { data: mirrorContract, isLoading } = useQuery({
    queryKey: ['getMirrorClient', mirrorAddress, ethereumClient],
    queryFn: () => getMirrorClient(mirrorAddress, ethereumClient!),
    enabled: Boolean(ethereumClient),
  });

  return { mirrorContract, isLoading };
};

export { useMirrorContract };
