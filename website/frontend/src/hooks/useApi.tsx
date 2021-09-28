import { useEffect, useState } from 'react';
import { GearApi } from '@gear-js/api';
import { initApi } from '../api/initApi';

export const useApi = (): [GearApi | null, boolean] => {
  const [gear, setGear] = useState<null | GearApi>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initApi().then((result) => {
      setGear(result);
      setLoading(false);
    });
  }, []);

  return [gear, loading];
};
