import { HexString } from '@vara-eth/api';
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useSyncExternalStore } from 'react';
import { useConfig } from 'wagmi';

import { MirrorClientStore } from './store';

type Cache = Map<HexString, MirrorClientStore>;

const Context = createContext<Cache | undefined>(undefined);
const { Provider } = Context;

function useMirrorClient(address: HexString) {
  const config = useConfig();
  const cache = useContext(Context);

  if (!cache) throw new Error('useMirrorClient must be used within a MirrorClientProvider');

  let store = cache.get(address);

  if (!store) {
    store = new MirrorClientStore(config, address);
    cache.set(address, store);
  }

  useEffect(() => {
    store.start();

    return () => store.stop();
  }, [store]);

  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

function MirrorClientProvider({ children }: PropsWithChildren) {
  const cacheRef = useRef(new Map<HexString, MirrorClientStore>());

  return <Provider value={cacheRef.current}>{children}</Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export { MirrorClientProvider, useMirrorClient };
