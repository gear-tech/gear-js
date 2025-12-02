import { useEthereumClient } from '@/app/api/use-ethereum-client';

const useWrappedVaraContract = () => {
  const ethereumClient = useEthereumClient();

  if (!ethereumClient) {
    return { wrappedVaraContract: null, isLoading: true };
  }

  return { wrappedVaraContract: ethereumClient.wvara, isLoading: false };
};

export { useWrappedVaraContract };
