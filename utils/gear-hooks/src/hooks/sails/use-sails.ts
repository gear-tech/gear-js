import { HexString } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { useQuery } from '@tanstack/react-query';
import { Sails } from 'sails-js';

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

    const sails = await Sails.new();

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
