import { createContext, useState } from 'react';
import Props from './types';

type Value = {
  isLoading: boolean;
  refresh: boolean;
  enableLoading: () => void;
  disableLoading: () => void;
  triggerRefresh: () => void;
};

const LoadingContext = createContext<Value>({} as Value);

function LoadingProvider({ children }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const enableLoading = () => {
    setIsLoading(true);
  };

  const disableLoading = () => {
    setIsLoading(false);
  };

  const triggerRefresh = () => {
    setRefresh((prevValue) => !prevValue);
  };

  const { Provider } = LoadingContext;
  const value = { isLoading, refresh, enableLoading, disableLoading, triggerRefresh };

  return <Provider value={value}>{children}</Provider>;
}

export { LoadingContext, LoadingProvider };
