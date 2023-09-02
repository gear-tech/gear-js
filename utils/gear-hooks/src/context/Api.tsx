import { createContext, useEffect, useState } from 'react';
import { GearApi } from '@gear-js/api';
import { ProviderProps } from 'types';
import { WsProvider } from '@polkadot/api';

type Value = {
  api: GearApi;
  isApiReady: boolean;
};

type Props = ProviderProps & {
  providerAddress: string;
  timeout?: number;
};

const ApiContext = createContext({} as Value);

function ApiProvider({ providerAddress, timeout, children }: Props) {
  const [api, setApi] = useState<GearApi>();

  const { Provider } = ApiContext;
  const value = { api: api as GearApi, isApiReady: !!api };

  useEffect(() => {
    const provider = new WsProvider(providerAddress, undefined, undefined, timeout);

    GearApi.create({ provider }).then(setApi);
  }, []);

  return <Provider value={value}>{children}</Provider>;
}

export { ApiContext, ApiProvider };
