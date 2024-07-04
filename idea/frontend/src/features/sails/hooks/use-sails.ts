import { HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { RPCError, RPCErrorCode } from '@/shared/services/rpcService';

import { getIdl } from '../api';
import { SAILS } from '../consts';

function useSails(codeId: HexString | null | undefined) {
  const alert = useAlert();

  const getSails = async () => {
    if (!codeId) throw new Error('Code ID is not found');

    const { result } = await getIdl(codeId);
    const sails = SAILS.parseIdl(result);

    return { idl: result, sails };
  };

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['idl', codeId],
    queryFn: getSails,
    enabled: Boolean(codeId),
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
