import { GearExeApi } from 'gearexe';
import { createContext } from 'react';

type Value =
  | {
      api: undefined;
      isApiReady: false;
    }
  | {
      api: GearExeApi;
      isApiReady: true;
    };

const initialValue = {
  api: undefined,
  isApiReady: false as const,
};

export const ApiContext = createContext<Value>(initialValue);
