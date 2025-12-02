import { useEthereumClient } from './use-ethereum-client';

const useRouterContract = () => {
  const ethereumClient = useEthereumClient();

  if (!ethereumClient) {
    return { routerContract: null, isLoading: true };
  }

  return { routerContract: ethereumClient.router, isLoading: false };
};

export { useRouterContract };
