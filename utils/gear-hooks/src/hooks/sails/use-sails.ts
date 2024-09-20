import { HexString } from '@gear-js/api';
import { useQuery } from '@tanstack/react-query';
import { Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';

import { useApi } from 'context';

type UseSailsParameters = {
  programId?: HexString | undefined;
  idl?: string | undefined;
};

const DEFAULT_PARAMETERS = {
  programId: undefined,
  idl: undefined,
} as const;

function useSails({ programId, idl }: UseSailsParameters = DEFAULT_PARAMETERS) {
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
    queryKey: ['sails', api?.provider.endpoint, programId, idl],
    queryFn: getSails,
    enabled: isApiReady,
  });
}

export { useSails };
export type { UseSailsParameters };
