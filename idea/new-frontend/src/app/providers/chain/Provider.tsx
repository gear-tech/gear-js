import { ProviderProps, useApi } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

import { RpcMethods } from 'shared/config';
import { RPCService } from 'shared/services/rpcService';

import { ChainContext } from './Context';

const { Provider } = ChainContext;

const ChainProvider = ({ children }: ProviderProps) => {
  const { api, isApiReady } = useApi();

  const [isDevChain, setIsDevChain] = useState<boolean>();
  const [isTestBalanceAvailable, setIsTestBalanceAvailable] = useState<boolean>();

  const isChainRequestReady = isDevChain !== undefined && isTestBalanceAvailable !== undefined;

  useEffect(() => {
    if (isApiReady) {
      const apiRequest = new RPCService();
      const genesis = api.genesisHash.toHex();

      const requests = [
        apiRequest.callRPC<boolean>(RpcMethods.NetworkData, { genesis }),
        apiRequest.callRPC<boolean>(RpcMethods.TestBalanceAvailable, { genesis }),
      ];

      Promise.all(requests).then(([{ result: isDevChainResult }, { result: isTestBalanceAvailableResult }]) => {
        setIsDevChain(!isDevChainResult);
        setIsTestBalanceAvailable(isTestBalanceAvailableResult);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady]);

  return <Provider value={{ isDevChain, isTestBalanceAvailable, isChainRequestReady }}>{children}</Provider>;
};

export { ChainProvider };
