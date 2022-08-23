import { ProviderProps, ApiProvider as GearApiProvider } from '@gear-js/react-hooks';

import { NODE_ADDRESS } from 'shared/config';

const ApiProvider = ({ children }: ProviderProps) => (
  <GearApiProvider providerAddress={NODE_ADDRESS}>{children}</GearApiProvider>
);

export { ApiProvider };
