import { useQuery } from '@tanstack/react-query';
import { getWrappedVaraContract } from 'gearexe';

import { useEthersSigner } from '@/app/api/ethers/signer';
import { WVARA_CONTRACT_ADDRESS } from '@/shared/config';

const useWrappedVaraContract = () => {
  const signer = useEthersSigner();

  const { data: wrappedVaraContract, isLoading } = useQuery({
    queryKey: ['getWrappedVaraContract', signer],
    queryFn: () => (signer ? getWrappedVaraContract(WVARA_CONTRACT_ADDRESS, signer) : null),
    enabled: Boolean(signer),
  });

  return { wrappedVaraContract, isLoading };
};

export { useWrappedVaraContract };
