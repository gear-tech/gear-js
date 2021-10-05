import { useEffect, useState } from 'react';
import { GearApi } from '@gear-js/api';
import { initApi } from '../api/initApi';

export const useApi = (): [GearApi | null, boolean] => {
  const [api, setApi] = useState<null | GearApi>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!api) {
      initApi().then((result) => {
        setApi(result);
        setIsLoading(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [api, isLoading];
};
