import { GearApi, HexString } from '@gear-js/api';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { useApi } from 'context';

type Program<T> = {
  new (api: GearApi, programId?: HexString): T;
};

type QueryOptions<T> = Omit<UseQueryOptions<T, undefined, T, (string | undefined)[]>, 'queryKey' | 'queryFn'>;

type UseProgramParameters<T> = {
  library: Program<T>;
  id: HexString | undefined;
  query?: QueryOptions<T>;
};

function useProgram<T>({ library, id, query }: UseProgramParameters<T>) {
  const { api, isApiReady } = useApi();

  const getProgram = () => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!id) throw new Error('Program ID is not found');

    return new library(api, id);
  };

  return useQuery({
    ...query,
    queryKey: ['program', id, api?.provider.endpoint],
    queryFn: getProgram,
    enabled: isApiReady && Boolean(id) && (query?.enabled ?? true),
  });
}

export { useProgram };
export type { UseProgramParameters };
