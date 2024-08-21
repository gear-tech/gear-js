import { useApi } from '@gear-js/react-hooks';
import { useInfiniteQuery } from '@tanstack/react-query';

import { DEFAULT_LIMIT } from '@/shared/config';

import { API_URL } from './consts';
import { getVouchers, getNextPageParam } from './utils';
import { VouchersParameters } from './types';

function useVouchers(parameters: VouchersParameters) {
  const { api } = useApi();
  const genesis = api?.genesisHash.toHex();
  const url = genesis ? API_URL[genesis as keyof typeof API_URL] : undefined;

  return useInfiniteQuery({
    queryKey: ['vouchers', url, parameters],
    queryFn: ({ pageParam }) => getVouchers(url!, { ...parameters, limit: DEFAULT_LIMIT, offset: pageParam }),

    // TODO: if indexer would return object with 'result' key instead of 'vouchers' key,
    // we would be able to reuse INFINITE_QUERY config from api consts
    initialPageParam: 0,
    getNextPageParam,
    select: ({ pages }) => ({ vouchers: pages.flatMap((page) => page.vouchers), count: pages[0].count }),

    enabled: Boolean(url),
  });
}

export { useVouchers };
