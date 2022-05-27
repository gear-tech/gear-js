import { createContext, useEffect, useState } from 'react';
import { GearApi } from '@gear-js/api';
import { Props as BaseProps } from './types';

type Value = {
  api: GearApi;
  isApiReady: boolean;
};

type Props = BaseProps & {
  providerAddress: string;
};

const ApiContext = createContext({} as Value);

function ApiProvider({ providerAddress, children }: Props) {
  const [api, setApi] = useState<GearApi>();

  const { Provider } = ApiContext;
  const value = { api: api as GearApi, isApiReady: !!api };

  useEffect(() => {
    GearApi.create({ providerAddress }).then(setApi);
  }, []);

  return <Provider value={value}>{children}</Provider>;
}

export { ApiContext, ApiProvider };
