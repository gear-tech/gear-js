import type { HexString } from '@gear-js/api';

import { useApi } from '@/context';

import type { QueryParameters } from '../../types';
import { useQuery } from '../use-query';

import type { ParsedSails } from './parse-idl';
import { useSailsInit } from './use-sails-init';

type UseSailsParameters<T> = QueryParameters<ParsedSails, T> & {
  programId?: HexString | undefined;
  idl?: string | undefined;
};

const DEFAULT_PARAMETERS = {
  programId: undefined,
  idl: undefined,
  query: {},
} as const;

function useSails<T = ParsedSails>({ programId, idl, query }: UseSailsParameters<T> = DEFAULT_PARAMETERS) {
  const { api, isApiReady } = useApi();
  const parseIdl = useSailsInit();

  const getSails = async () => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!parseIdl) throw new Error('Sails parser is not initialized');

    const program = parseIdl(idl || '');

    program.setApi(api);
    if (programId) program.setProgramId(programId);

    return program;
  };

  return useQuery({
    ...query,
    queryKey: ['sails', api?.provider.endpoint, programId, idl],
    queryFn: getSails,
    enabled: isApiReady && Boolean(parseIdl) && (query?.enabled ?? true),
  });
}

export type { UseSailsParameters };
export { useSails };
