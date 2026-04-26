import { ApiProvider as GearApiProvider, type ProviderProps } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

import { INITIAL_ENDPOINT } from '@/features/api';

type BundledMetadata = Record<`0x${string}-${number}`, `0x${string}`>;
type LoadState = { loaded: boolean; metadata?: BundledMetadata };

// Only preload bundled metadata for endpoints we ship a bundle for. Custom/dev RPCs
// (URL param, localhost) skip the chunk download since the key won't match anyway.
// Accepts null because localStorage[...] can return null and INITIAL_ENDPOINT inherits that.
const isBundledEndpoint = (endpoint: string | null | undefined) => endpoint == null || /vara\.network/.test(endpoint);

const USE_BUNDLED = import.meta.env.VITE_BUNDLED_METADATA !== 'false' && isBundledEndpoint(INITIAL_ENDPOINT);

// Eager-preload at module top so Vite emits a separate chunk and the network fetch
// starts at JS parse time — racing the WS handshake instead of blocking after it.
const metadataPromise: Promise<BundledMetadata | undefined> = USE_BUNDLED
  ? import('@/shared/config/bundled-metadata').then((m) => m.BUNDLED_METADATA)
  : Promise.resolve(undefined);

const ApiProvider = ({ children }: ProviderProps) => {
  const [state, setState] = useState<LoadState>({ loaded: !USE_BUNDLED });

  useEffect(() => {
    if (!USE_BUNDLED) return;
    metadataPromise
      .then((metadata) => setState({ loaded: true, metadata }))
      .catch((error) => {
        // Chunk load failed (network, parse error, deploy mismatch). Fall back
        // to the original RPC-fetch path so the app never gets stuck rendering null.
        console.error('bundled metadata chunk failed to load; falling back to RPC fetch', error);
        setState({ loaded: true });
      });
  }, []);

  // Bounded by the lazy-chunk fetch (~180 KB). On a healthy connection this resolves
  // before the WS handshake completes; if it ever measures slower in production,
  // swap to a Suspense fallback rendering the existing app shell.
  if (!state.loaded) return null;

  return (
    <GearApiProvider initialArgs={{ endpoint: INITIAL_ENDPOINT, metadata: state.metadata }}>{children}</GearApiProvider>
  );
};

export { ApiProvider };
