import { useEffect, useState } from 'react';
import { GearApi } from '@gear-js/api';
import { initApi } from '../api/initApi';

let api: GearApi | null = null;

export const useApi = (): [GearApi | null, boolean] => {
  const [gear, setGear] = useState<null | GearApi>(api || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gear) {
      initApi().then((result) => {
        setGear(result);
        api = result;
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [gear, loading];
};
