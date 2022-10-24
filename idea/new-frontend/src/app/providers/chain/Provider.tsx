import { ProviderProps, useApi } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

import { RpcMethods } from 'shared/config';
import { RPCService } from 'shared/services/rpcService';

import { ChainContext } from './Context';

const { Provider } = ChainContext;

const ChainProvider = ({ children }: ProviderProps) => {
  const { api } = useApi();
  const genesis = api?.genesisHash.toHex();

  const [isDevChain, setIsDevChain] = useState<boolean>();
  const [isTestBalanceAvailable, setIsTestBalanceAvailable] = useState<boolean>();

  const isChainRequestReady = isDevChain !== undefined && isTestBalanceAvailable !== undefined;

  useEffect(() => {
    if (genesis) {
      const apiRequest = new RPCService();

      apiRequest.callRPC<boolean>(RpcMethods.NetworkData, { genesis }).then(({ result }) => setIsDevChain(!result));
    }
  }, [genesis]);

  useEffect(() => {
    if (isDevChain) {
      setIsTestBalanceAvailable(true);
    } else {
      const apiRequest = new RPCService();

      apiRequest
        .callRPC<boolean>(RpcMethods.TestBalanceAvailable, { genesis })
        .then(({ result }) => setIsTestBalanceAvailable(result));
    }
  }, [isDevChain, genesis]);

  return <Provider value={{ isDevChain, isTestBalanceAvailable, isChainRequestReady }}>{children}</Provider>;
};

export { ChainProvider };
