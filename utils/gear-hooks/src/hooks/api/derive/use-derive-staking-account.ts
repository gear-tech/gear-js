import { DeriveStakingAccount } from '@polkadot/api-derive/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useApi } from 'context';
import { QueryParameters } from 'types';

type UseDeriveStakingAccountParameters<T> = QueryParameters<DeriveStakingAccount, T> & {
  address: string | undefined;
  watch?: boolean;
};

function useDeriveStakingAccount<T = DeriveStakingAccount>({
  address,
  watch,
  query,
}: UseDeriveStakingAccountParameters<T>) {
  const { api, isApiReady } = useApi();

  const queryClient = useQueryClient();
  const queryKey = ['deriveStakingAccount', api?.provider.endpoint, address];

  const getDeriveStakingAccount = () => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!address) throw new Error('Address not found');

    return api.derive.staking.account(address);
  };

  useEffect(() => {
    if (!isApiReady || !address || !watch) return;

    // two api calls are made on first render, it can be optimized
    // also, what should happen if watch is enabled, but query itself is disabled?
    // should watch be in a queryKey?
    const unsub = api.derive.staking.account(address, undefined, (result) => {
      queryClient.setQueryData(queryKey, result);
    });

    return () => {
      unsub.then((unsubCallback) => unsubCallback());
    };
  }, [api, address, watch]);

  return useQuery({
    ...query,
    queryKey,
    queryFn: getDeriveStakingAccount,
    enabled: isApiReady && Boolean(address) && (query?.enabled ?? true),
  });
}

export { useDeriveStakingAccount };
export type { UseDeriveStakingAccountParameters };
