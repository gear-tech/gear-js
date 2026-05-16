import type { BundledMetadata } from '@gear-js/bundled-metadata';
import { ApiProvider as GearApiProvider, type ProviderProps } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

import { INITIAL_ENDPOINT } from '@/features/api';

type LoadState = { loaded: boolean; metadata?: BundledMetadata };

// Only preload bundled metadata for endpoints we ship a bundle for. Custom/dev RPCs
// (URL param, localhost) skip the chunk download since the key won't match anyway.
// Accepts null because localStorage[...] can return null and INITIAL_ENDPOINT inherits that.
const isBundledEndpoint = (endpoint: string | null | undefined) => endpoint == null || /vara\.network/.test(endpoint);

const USE_BUNDLED = import.meta.env.VITE_BUNDLED_METADATA !== 'false' && isBundledEndpoint(INITIAL_ENDPOINT);

// Cap the chunk-fetch wait so a stalled CDN edge / proxy / flaky mobile network
// can't strand the app on a blank render. A healthy connection delivers the
// ~1.2 MB chunk in well under 1 s; 3 s is generous before we fall through to
// the RPC-fetch path.
const CHUNK_TIMEOUT_MS = 3000;

const withTimeout = <T,>(p: Promise<T>, ms: number) => {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<T>((_, rej) => {
    timer = setTimeout(() => rej(new Error('bundled-metadata chunk timed out')), ms);
  });
  return Promise.race([p, timeout]).finally(() => clearTimeout(timer));
};

// Eager-preload at module top so Vite emits a separate chunk and the network fetch
// starts at JS parse time — racing the WS handshake instead of blocking after it.
const metadataPromise: Promise<BundledMetadata | undefined> = USE_BUNDLED
  ? withTimeout(
      import('@gear-js/bundled-metadata').then((m) => m.BUNDLED_METADATA),
      CHUNK_TIMEOUT_MS,
    )
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
