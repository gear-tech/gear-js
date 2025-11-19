import { useQuery } from '@tanstack/react-query';
import { getWrappedVaraClient } from '@vara-eth/api';

import { useEthereumClient } from '@/app/api/use-ethereum-client';
import { WVARA_CONTRACT_ADDRESS } from '@/shared/config';

const useWrappedVaraContract = () => {
  const ethereumClient = useEthereumClient();

  const { data: wrappedVaraContract, isLoading } = useQuery({
    queryKey: ['getWrappedVaraClient', ethereumClient],
    queryFn: () => getWrappedVaraClient(WVARA_CONTRACT_ADDRESS, ethereumClient!),
    enabled: Boolean(ethereumClient),
  });

  return { wrappedVaraContract, isLoading };
};

export { useWrappedVaraContract };
