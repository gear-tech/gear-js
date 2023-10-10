import { ProviderProps, ApiProvider as GearApiProvider } from '@gear-js/react-hooks';

import { INITIAL_ENDPOINT } from '@/features/api';

const ApiProvider = ({ children }: ProviderProps) => (
  <GearApiProvider initialArgs={{ endpoint: INITIAL_ENDPOINT }}>{children}</GearApiProvider>
);

export { ApiProvider };
