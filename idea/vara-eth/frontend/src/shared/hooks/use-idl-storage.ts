import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Hex } from 'viem';

import { addIdl, getIdl } from '@/features/sails/lib';
import { useSailsInit } from '@/features/sails/lib/use-sails-init';

const IDL_QUERY_KEY = 'idl';

type UseIdlStorageReturn = {
  idl: string | null;
  isLoading: boolean;
  saveIdl: (idlContent: string) => Promise<string | null>;
};

export const useIdlStorage = (codeId?: Hex): UseIdlStorageReturn => {
  const queryClient = useQueryClient();
  const parseIdl = useSailsInit();

  const queryKey = [IDL_QUERY_KEY, codeId];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => getIdl(codeId!),
    enabled: Boolean(codeId),
    retry: false,
  });

  type AddIdlMutationVariables = {
    codeId: Hex;
    idlContent: string;
  };

  const mutation = useMutation({
    mutationFn: ({ codeId, idlContent }: AddIdlMutationVariables) => addIdl(codeId, idlContent),
    onSuccess: (_, { codeId, idlContent }) => {
      queryClient.setQueryData([IDL_QUERY_KEY, codeId], { codeId, data: idlContent });
    },
  });

  const saveIdl = async (idlContent: string): Promise<string | null> => {
    if (!codeId) {
      return 'Code ID is not found';
    }

    if (!parseIdl) {
      return 'Sails parser is not initialized. Please try again.';
    }

    try {
      await parseIdl(idlContent);
    } catch (error) {
      return error instanceof Error ? error.message : 'Invalid IDL file';
    }

    mutation.mutate({ codeId, idlContent });

    return null;
  };

  return { idl: data?.data ?? null, isLoading, saveIdl };
};
