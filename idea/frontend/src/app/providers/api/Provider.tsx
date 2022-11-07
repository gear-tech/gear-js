import { ProviderProps, ApiProvider as GearApiProvider } from '@gear-js/react-hooks';

import { useApp } from 'hooks';

const ApiProvider = ({ children }: ProviderProps) => {
  const { nodeAddress } = useApp();

  return <GearApiProvider providerAddress={nodeAddress}>{children}</GearApiProvider>;
};

export { ApiProvider };
