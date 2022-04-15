import { createContext, useEffect, useState } from 'react';
import { GearApi } from '@gear-js/api';
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
    const providerAddress = process.env.REACT_APP_NODE_ADDRESS;
    GearApi.create({ providerAddress }).then(setApi);
  }, []);

  return <Provider value={value}>{children}</Provider>;
}

export { ApiContext, ApiProvider };
