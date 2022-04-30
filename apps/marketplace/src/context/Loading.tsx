import { createContext, useState } from 'react';
import Props from './types';

type Value = {
  isLoading: boolean;
  enableLoading: () => void;
  disableLoading: () => void;
};

const LoadingContext = createContext<Value>({} as Value);

function LoadingProvider({ children }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const enableLoading = () => {
    setIsLoading(true);
  };

  const disableLoading = () => {
    setIsLoading(false);
  };

  const { Provider } = LoadingContext;
  const value = { isLoading, enableLoading, disableLoading };

  return <Provider value={value}>{children}</Provider>;
}

export { LoadingContext, LoadingProvider };
