import { GearApi } from '@gear-js/api';
import { ScProvider, WsProvider } from '@polkadot/api';
import * as Sc from '@substrate/connect';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import type { ProviderProps } from '../types';

type BundledMetadata = Record<`0x${string}-${number}`, `0x${string}`>;

type CommonProviderArgs = {
  metadata?: BundledMetadata;
};

type WsProviderArgs = CommonProviderArgs & {
  endpoint: string | string[];
  autoConnectMs?: number | false;
  headers?: Record<string, string>;
  timeout?: number;
};

type ScProviderArgs = CommonProviderArgs & {
  spec: string;
  sharedSandbox?: ScProvider;
};

type ProviderArgs = WsProviderArgs | ScProviderArgs;

type Value = {
  switchNetwork: (args: ProviderArgs) => Promise<void>;
} & (
  | {
      api: undefined;
      isApiReady: false;
      isV110Runtime: false;
    }
  | {
      api: GearApi;
      isApiReady: true;
      isV110Runtime: boolean;
    }
);

type Props = ProviderProps & {
  initialArgs: ProviderArgs;
};

const initialValue = {
  api: undefined,
  isApiReady: false as const,
  isV110Runtime: false as const,
  switchNetwork: () => Promise.resolve(),
};

const ApiContext = createContext<Value>(initialValue);
const { Provider } = ApiContext;

let sessionCounter = 0;
const nextSessionId = () => `${Date.now().toString(36)}-${(sessionCounter++).toString(36)}`;

const hasPerf = typeof performance !== 'undefined';
const mark = (name: string) => {
  if (hasPerf) performance.mark(name);
};

function ApiProvider({ initialArgs, children }: Props) {
  const [api, setApi] = useState<GearApi>();
  const providerRef = useRef<WsProvider | ScProvider>(undefined);
  const providerUnsubRef = useRef<() => void>(undefined);
  // Hold the bundled metadata default so switchNetwork callers (e.g. NodesSwitch)
  // don't drop the optimisation when they pass { endpoint } without metadata.
  const metadataDefaultRef = useRef<BundledMetadata | undefined>(initialArgs.metadata);

  const switchNetwork = async (args: ProviderArgs) => {
    if (providerRef.current && providerUnsubRef.current) {
      setApi(undefined);
      await providerRef.current.disconnect();
      providerUnsubRef.current();
    }

    const metadata = args.metadata ?? metadataDefaultRef.current;
    const isLightClient = 'spec' in args;

    const provider = isLightClient
      ? new ScProvider(Sc as ConstructorParameters<typeof ScProvider>[0], args.spec, args.sharedSandbox)
      : new WsProvider(args.endpoint, args.autoConnectMs, args.headers, args.timeout);

    providerRef.current = provider;

    const sessionId = nextSessionId();
    const markConnectStart = `gear-api:provider-connect-start:${sessionId}`;
    const markConnected = `gear-api:provider-connected:${sessionId}`;
    const markReady = `gear-api:ready:${sessionId}`;
    const measureName = `gear-api:metadata-window:${sessionId}`;
    mark(markConnectStart);

    providerUnsubRef.current = provider.on('connected', async () => {
      mark(markConnected);
      try {
        const created = await GearApi.create({ provider, metadata });
        // Stale check: if switchNetwork was called again while we were
        // awaiting GearApi.create, the active provider has moved on. Drop
        // this result instead of overwriting the newer session's state.
        if (providerRef.current !== provider) return;
        if (hasPerf) {
          performance.mark(markReady);
          performance.measure(measureName, markConnected, markReady);
          // Bound buffer growth across reconnects/network-switches.
          performance.clearMarks(markConnectStart);
          performance.clearMarks(markConnected);
          performance.clearMarks(markReady);
          performance.clearMeasures(measureName);
        }
        setApi(created);
      } catch (error) {
        if (providerRef.current !== provider) return;
        setApi(undefined);
        console.error('GearApi.create failed', error);
      }
    });

    if (isLightClient) await provider.connect();
  };

  useEffect(() => {
    switchNetwork(initialArgs);
  }, []);

  const value = useMemo(
    () =>
      api
        ? { api, isApiReady: true as const, isV110Runtime: api.specVersion >= 1100, switchNetwork }
        : { api, isApiReady: false as const, isV110Runtime: false as const, switchNetwork },
    [api],
  );

  return <Provider value={value}>{children}</Provider>;
}

const useApi = () => useContext(ApiContext);

export { ApiProvider, useApi };
