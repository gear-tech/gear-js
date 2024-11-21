import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useApi } from 'context';
import { QueryParameters } from 'types';

type UseDeriveBalancesAllParameters<T> = QueryParameters<DeriveBalancesAll, T> & {
  address: string | undefined;
  watch?: boolean;
};

function useDeriveBalancesAll<T = DeriveBalancesAll>({ address, watch, query }: UseDeriveBalancesAllParameters<T>) {
  const { api, isApiReady } = useApi();

  const queryClient = useQueryClient();
  const queryKey = ['deriveBalancesAll', api?.provider.endpoint, address];

  const getDeriveBalancesAll = () => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!address) throw new Error('Address not found');

    return api.derive.balances.all(address);
  };

  useEffect(() => {
    if (!isApiReady || !address || !watch) return;

    // two api calls are made on first render, it can be optimized
    // also, what should happen if watch is enabled, but query itself is disabled?
    // should watch be in a queryKey?
    const unsub = api.derive.balances.all(address, (result) => {
      queryClient.setQueryData(queryKey, result);
    });

    return () => {
      unsub.then((unsubCallback) => unsubCallback());
    };
  }, [api, address, watch]);

  return useQuery({
    ...query,
    queryKey,
    queryFn: getDeriveBalancesAll,
    enabled: isApiReady && Boolean(address) && (query?.enabled ?? true),
  });
}

export { useDeriveBalancesAll };
export type { UseDeriveBalancesAllParameters };
