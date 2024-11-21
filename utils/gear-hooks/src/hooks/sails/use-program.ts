import { GearApi, HexString } from '@gear-js/api';
import { useQuery } from '@tanstack/react-query';

import { useApi } from 'context';

import { QueryParameters } from './types';

type Program<T> = {
  new (api: GearApi, programId?: HexString): T;
};

type UseProgramParameters<TQueryFnData, TData> = QueryParameters<TQueryFnData, TData> & {
  library: Program<TQueryFnData>;
  id: HexString | undefined;
};

function useProgram<TQueryFnData, TData = TQueryFnData>({
  library,
  id,
  query,
}: UseProgramParameters<TQueryFnData, TData>) {
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
