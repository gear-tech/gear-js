import { VaraEthApi, WsVaraEthProvider } from '@vara-eth/api';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';

import { VARA_ETH_NODE_ADDRESS } from '@/shared/config';

import { ApiContext } from './context';

const VaraEthApiProvider = ({ children }: PropsWithChildren) => {
  const [api, setApi] = useState<VaraEthApi>();

  useEffect(() => {
    const instance = new VaraEthApi(new WsVaraEthProvider(VARA_ETH_NODE_ADDRESS));
    setApi(instance);

    return () => {
      void instance.provider.disconnect();
    };
  }, []);

  const value = useMemo(() => (api ? { api, isApiReady: true as const } : { api, isApiReady: false as const }), [api]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export { VaraEthApiProvider };
