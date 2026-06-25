import type { HexString } from '@gear-js/api';
import { useAlert, useApi, useSailsInit } from '@gear-js/react-hooks';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getIdl } from '../api';
import { errorMessage } from '../api/consts';

function useSails(codeId: HexString | null | undefined, programId?: HexString) {
  const sailsInit = useSailsInit();
  const { api, isApiReady } = useApi();
  const alert = useAlert();

  const getSails = async () => {
    if (!sailsInit) throw new Error('Sails is not initialized');
    if (!isApiReady) throw new Error('API is not initialized');
    if (!codeId) throw new Error('Code ID is not found');

    const { data } = await getIdl(codeId);
    const program = await sailsInit(data);

    program.setApi(api);
    if (programId) program.setProgramId(programId);

    return program;
  };

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['idl', codeId, programId, api?.provider.endpoint],
    queryFn: getSails,
    enabled: Boolean(codeId && sailsInit && isApiReady),
  });

  useEffect(() => {
    if (!error) return;
    if (error.message === errorMessage.sailsIdlNotFound) return;

    alert.error(error.message);
  }, [error]);

  const isLoading = codeId !== null && isPending;

  return { sails: data, isLoading, refetch };
}

export { useSails };
