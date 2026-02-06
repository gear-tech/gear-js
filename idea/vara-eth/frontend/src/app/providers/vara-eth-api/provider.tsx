import { VaraEthApi, WsVaraEthProvider } from '@vara-eth/api';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';

import { useEthereumClient } from '@/app/api';
import { VARA_ETH_NODE_ADDRESS } from '@/shared/config';

import { ApiContext } from './context';

const VaraEthApiProvider = ({ children }: PropsWithChildren) => {
  const { data: ethereumClient } = useEthereumClient();

  const [api, setApi] = useState<VaraEthApi>();

  useEffect(() => {
    setApi(undefined);

    if (!ethereumClient) return;

    const instance = new VaraEthApi(new WsVaraEthProvider(VARA_ETH_NODE_ADDRESS), ethereumClient);

    setApi(instance);

    return () => {
      instance.provider.disconnect().catch((error) => console.error(error));
    };
  }, [ethereumClient]);

  const value = useMemo(() => (api ? { api, isApiReady: true as const } : { api, isApiReady: false as const }), [api]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export { VaraEthApiProvider };
