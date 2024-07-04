import { HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { RPCError, RPCErrorCode } from '@/shared/services/rpcService';

import { getIdl } from '../api';
import { useSailsInit } from './use-sails-init';

function useSails(codeId: HexString | null | undefined) {
  const sails = useSailsInit();
  const alert = useAlert();

  const getSails = async () => {
    if (!sails) throw new Error('Sails is not initialized');
    if (!codeId) throw new Error('Code ID is not found');

    const { result } = await getIdl(codeId);

    return { idl: result, sails: sails.parseIdl(result) };
  };

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['idl', codeId],
    queryFn: getSails,
    enabled: Boolean(codeId && sails),
  });

  useEffect(() => {
    if (!error) return;
    if (error instanceof RPCError && error.code === RPCErrorCode.MetadataNotFound) return;

    alert.error(error.message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const isLoading = isPending;

  return { ...data, isLoading, refetch };
}

export { useSails };
