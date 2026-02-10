import { EthereumClient } from '@vara-eth/api';
import { useContext, PropsWithChildren, useMemo, useEffect, useSyncExternalStore, createContext } from 'react';
import { useConfig } from 'wagmi';

import { ROUTER_CONTRACT_ADDRESS } from '@/shared/config';

import { EthereumClientStore } from './store';

const Context = createContext<EthereumClient | undefined>(undefined);
const { Provider } = Context;
const useEthereumClient = () => useContext(Context);

function EthereumClientProvider({ children }: PropsWithChildren) {
  const config = useConfig();
  const store = useMemo(() => new EthereumClientStore(config, ROUTER_CONTRACT_ADDRESS), [config]);

  useEffect(() => {
    store.start().catch((error) => console.error('Error starting EthereumClientStore:', error));

    return () => store.stop();
  }, [store]);

  return (
    <Provider value={useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)}>{children}</Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { EthereumClientProvider, useEthereumClient };
