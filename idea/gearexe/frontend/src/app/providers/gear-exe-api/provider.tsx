import { GearExeApi, HttpGearexeProvider } from 'gearexe';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';

import { GEAR_EXE_NODE_ADDRESS } from '@/shared/config';

import { ApiContext } from './context';

const GearExeApiProvider = ({ children }: PropsWithChildren) => {
  const [api, setApi] = useState<GearExeApi>();

  useEffect(() => {
    const instance = new GearExeApi(new HttpGearexeProvider(GEAR_EXE_NODE_ADDRESS));
    setApi(instance);

    return () => {
      void instance.provider.disconnect();
    };
  }, []);

  const value = useMemo(() => (api ? { api, isApiReady: true as const } : { api, isApiReady: false as const }), [api]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export { GearExeApiProvider };
