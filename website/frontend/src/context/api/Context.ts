import { createContext } from 'react';
import { GearApi } from '@gear-js/api';

type Value = {
  api: GearApi;
  isApiReady: boolean;
};

const ApiContext = createContext({} as Value);

export { ApiContext };
