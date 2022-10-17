import { ProviderProps, useApi } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

import { RpcMethods } from 'shared/config';
import { RPCService } from 'shared/services/rpcService';

import { ChainContext } from './Context';

const { Provider } = ChainContext;

const ChainProvider = ({ children }: ProviderProps) => {
  const { api, isApiReady } = useApi();

  const [isDevChain, setIsDevChain] = useState<boolean>();
  const isChainRequestReady = isDevChain !== undefined;

  useEffect(() => {
    if (isApiReady) {
      const apiRequest = new RPCService();
      const genesis = api.genesisHash.toHex();

      apiRequest.callRPC<boolean>(RpcMethods.NetworkData, { genesis }).then(({ result }) => setIsDevChain(!result));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady]);

  return <Provider value={{ isDevChain, isChainRequestReady }}>{children}</Provider>;
};

export { ChainProvider };
