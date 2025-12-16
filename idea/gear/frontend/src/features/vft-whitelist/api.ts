import { HexString } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { GENESIS } from '@/shared/config';
import { fetchWithGuard } from '@/shared/helpers';

type Whitelist = {
  mainnet: HexString[];
  testnet: HexString[];
};

const GENESIS_TO_WHITELIST_KEY = {
  [GENESIS.MAINNET]: 'mainnet',
  [GENESIS.TESTNET]: 'testnet',
} as const;

const VFT_WHITELIST_API_URL = import.meta.env.VITE_VFT_WHITELIST_API_URL as string;

const getVftWhitelist = () => fetchWithGuard<Whitelist>({ url: VFT_WHITELIST_API_URL });

function useVftWhitelistNetwork() {
  const { api } = useApi();
  const genesis = api?.genesisHash.toHex();

  if (genesis) return GENESIS_TO_WHITELIST_KEY[genesis as keyof typeof GENESIS_TO_WHITELIST_KEY];
}

function useVftWhitelist<T = HexString[]>(onSelect: (data: HexString[]) => T = (data) => data as T) {
  const network = useVftWhitelistNetwork();

  const select = useCallback(
    (data: Whitelist) => {
      if (!network) throw new Error('Unsupported network for VFT whitelist');

      return onSelect(data[network]);
    },
    [network, onSelect],
  );

  return useQuery({
    queryKey: ['vft-whitelist'],
    queryFn: getVftWhitelist,
    enabled: Boolean(network),
    select,
  });
}

function useIsVftProgram(programId: HexString) {
  const isVft = useCallback((ids: HexString[] | undefined) => ids?.includes(programId), [programId]);

  return useVftWhitelist(isVft);
}

export { useIsVftProgram };
