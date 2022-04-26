import { createContext, useEffect, useState } from 'react';
import { GearApi } from '@gear-js/api';
import { NODE_ADDRESS } from 'consts';
import Props from './types';

type Value = {
  api: GearApi;
  isApiReady: boolean;
};

const ApiContext = createContext({} as Value);

function ApiProvider({ children }: Props) {
  const [api, setApi] = useState<GearApi>();

  const { Provider } = ApiContext;
  const value = { api: api as GearApi, isApiReady: !!api };

  useEffect(() => {
    GearApi.create({ providerAddress: NODE_ADDRESS }).then(setApi);
  }, []);

  return <Provider value={value}>{children}</Provider>;
}

export { ApiContext, ApiProvider };
