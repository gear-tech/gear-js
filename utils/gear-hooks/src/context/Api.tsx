import { GearApi } from '@gear-js/api';
import { WsProvider, ScProvider } from '@polkadot/api';
import * as Sc from '@substrate/connect';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { ProviderProps } from 'types';

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
  const providerRef = useRef<WsProvider | ScProvider>();

  const switchNetwork = async (args: ProviderArgs) => {
    // disconnect from provider instead of api,
    // cuz on failed GearApi.create connection is already established,
    // but api state is empty
    if (providerRef.current) {
      setApi(undefined);
      await providerRef.current.disconnect();
    }

    const isLightClient = 'spec' in args;

    const provider = isLightClient
      ? new ScProvider(Sc, args.spec, args.sharedSandbox)
      : new WsProvider(args.endpoint, args.autoConnectMs, args.headers, args.timeout);

    providerRef.current = provider;

    // on set autoConnectMs connection starts automatically,
    // and in case of error it continues to execute via recursive setTimeout.
    // cuz of this it's necessary to await empty promise,
    // otherwise GearApi.create would be called before established connection.

    // mostly it's a workaround around React.StrictMode hooks behavior to support autoConnect,
    // and since it's based on ref and WsProvider's implementation,
    // it should be treated carefully
    await (isLightClient || (args.autoConnectMs !== undefined && !args.autoConnectMs)
      ? provider.connect()
      : Promise.resolve());

    const result = await GearApi.create({ provider });
    setApi(result);
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
