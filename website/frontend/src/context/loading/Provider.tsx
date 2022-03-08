import { useState } from 'react';
import { LoadingContext } from './Context';
import { Props } from '../types';

const { Provider } = LoadingContext;

const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const enableLoading = () => {
    setIsLoading(true);
  };

  const disableLoading = () => {
    setIsLoading(false);
  };

  return { isLoading, enableLoading, disableLoading };
};

const LoadingProvider = ({ children }: Props) => <Provider value={useLoading()}>{children}</Provider>;

export { LoadingProvider };
