import { HexString } from '@gear-js/api';
import { Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';

import { useApi } from 'context';

import { QueryParameters } from '../../types';
import { useQuery } from '../use-query';

type UseSailsParameters<T> = QueryParameters<Sails, T> & {
  programId?: HexString | undefined;
  idl?: string | undefined;
};

const DEFAULT_PARAMETERS = {
  programId: undefined,
  idl: undefined,
  query: {},
} as const;

function useSails<T = Sails>({ programId, idl, query }: UseSailsParameters<T> = DEFAULT_PARAMETERS) {
  const { api, isApiReady } = useApi();

  const getSails = async () => {
    if (!isApiReady) throw new Error('API is not initialized');

    const parser = await SailsIdlParser.new();
    const sails = new Sails(parser);

    sails.setApi(api);
    if (programId) sails.setProgramId(programId);
    if (idl) sails.parseIdl(idl);

    return sails;
  };

  return useQuery({
    ...query,
    queryKey: ['sails', api?.provider.endpoint, programId, idl],
    queryFn: getSails,
    enabled: isApiReady && (query?.enabled ?? true),
  });
}

export { useSails };
export type { UseSailsParameters };
