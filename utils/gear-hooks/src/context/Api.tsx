import { GearApi } from '@gear-js/api';
import { WsProvider, ScProvider } from '@polkadot/api';
import * as Sc from '@substrate/connect';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { ProviderProps } from '../types';

type WsProviderArgs = {
  endpoint: string | string[];
  autoConnectMs?: number | false;
  headers?: Record<string, string>;
  timeout?: number;
};

type ScProviderArgs = {
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

function ApiProvider({ initialArgs, children }: Props) {
  const [api, setApi] = useState<GearApi>();
  const providerRef = useRef<WsProvider | ScProvider>(undefined);
  const providerUnsubRef = useRef<() => void>(undefined);

  const switchNetwork = async (args: ProviderArgs) => {
    // disconnect from provider instead of api,
    // cuz on failed GearApi.create connection is already established,
    // but api state is empty
    if (providerRef.current && providerUnsubRef.current) {
      setApi(undefined);
      await providerRef.current.disconnect();
      providerUnsubRef.current();
    }

    const isLightClient = 'spec' in args;

    const provider = isLightClient
      ? // TODO: remove assertion after https://github.com/polkadot-js/api/issues/6065 is resolved
        new ScProvider(Sc as ConstructorParameters<typeof ScProvider>[0], args.spec, args.sharedSandbox)
      : new WsProvider(args.endpoint, args.autoConnectMs, args.headers, args.timeout);

    providerRef.current = provider;
    providerUnsubRef.current = provider.on('connected', async () => setApi(await GearApi.create({ provider })));

    if (isLightClient) await provider.connect();
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- TODO(#1816): resolve eslint comments
    switchNetwork(initialArgs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

// TODO: either fix only-export-components or remove rule
// eslint-disable-next-line react-refresh/only-export-components
export { ApiProvider, useApi };
