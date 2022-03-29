import { useEffect, useState } from 'react';
import { GearApi } from '@gear-js/api';
import { nodeApi } from 'api/initApi';
import { Props } from '../types';
import { ApiContext } from './Context';

const { Provider } = ApiContext;

const useApi = () => {
  const [api, setApi] = useState<GearApi>();
  const isApiReady = !!api;

  useEffect(() => {
    nodeApi.init().then(setApi);
  }, []);

  return { api: api as GearApi, isApiReady };
};

const ApiProvider = ({ children }: Props) => <Provider value={useApi()}>{children}</Provider>;

export { ApiProvider };
