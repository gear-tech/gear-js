import { useQuery } from '@tanstack/react-query';
import { getMirrorContract } from 'gearexe';
import { useAccount } from 'wagmi';

import { MIRROR_CONTRACT_ADDRESS } from '@/shared/config';

import { useEthersSigner } from './ethers/signer';

const useMirrorContract = (mirrorAddress = MIRROR_CONTRACT_ADDRESS) => {
  const ethAccount = useAccount();
  const signer = useEthersSigner({ chainId: ethAccount.chain?.id });

  const { data: mirrorContract, isLoading } = useQuery({
    queryKey: ['getMirrorContract', mirrorAddress, signer],
    queryFn: () => getMirrorContract(mirrorAddress, signer),
    enabled: Boolean(signer),
  });

  return { mirrorContract, isLoading };
};

export { useMirrorContract };
