import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Hex } from 'viem';

import { addIdl, getIdl } from '@/features/sails/lib';

const IDL_QUERY_KEY = 'idl';

type UseIdlStorageReturn = {
  idl: string | null;
  isLoading: boolean;
  saveIdl: (idlContent: string) => void;
};

export const useIdlStorage = (codeId?: Hex): UseIdlStorageReturn => {
  const queryClient = useQueryClient();

  const queryKey = [IDL_QUERY_KEY, codeId];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => getIdl(codeId!),
    enabled: Boolean(codeId),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: (idlContent: string) => addIdl(codeId!, idlContent),
    onSuccess: (_, idlContent) => {
      if (!codeId) return;

      queryClient.setQueryData(queryKey, { codeId, data: idlContent });
    },
  });

  const saveIdl = (idlContent: string) => {
    if (!codeId) {
      console.error('Code ID is not found');
      return;
    }

    mutation.mutate(idlContent);
  };

  return { idl: data?.data ?? null, isLoading, saveIdl };
};
