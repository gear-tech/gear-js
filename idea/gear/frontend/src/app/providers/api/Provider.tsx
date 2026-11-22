import { ApiProvider as GearApiProvider, type ProviderProps, useApi } from '@gear-js/react-hooks';

import { INITIAL_ENDPOINT, REQUIRES_NETWORK_SELECTION } from '@/features/api';
import { RETIRED_VARA_TESTNET_GENESIS } from '@/shared/config';

import { NetworkSelection } from './network-selection';

function SupportedNetwork({ children }: ProviderProps) {
  const { api } = useApi();

  // Also catch custom RPC aliases: no application/write controls mount on the retired chain.
  if (api?.genesisHash.toHex() === RETIRED_VARA_TESTNET_GENESIS) return <NetworkSelection />;

  return children;
}

const ApiProvider = ({ children }: ProviderProps) =>
  REQUIRES_NETWORK_SELECTION ? (
    <NetworkSelection />
  ) : (
    <GearApiProvider initialArgs={{ endpoint: INITIAL_ENDPOINT }}>
      <SupportedNetwork>{children}</SupportedNetwork>
    </GearApiProvider>
  );

export { ApiProvider };
