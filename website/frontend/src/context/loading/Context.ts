import { createContext } from 'react';

type Value = {
  isLoading: boolean;
  enableLoading: () => void;
  disableLoading: () => void;
};

const LoadingContext = createContext({} as Value);

export { LoadingContext };
