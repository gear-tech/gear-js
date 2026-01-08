import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';

const IDL_STORAGE_PREFIX = 'vara-eth-idl';

const getIdlStorageKey = (codeId: HexString) => `${IDL_STORAGE_PREFIX}-${codeId}`;

const getIdlQueryKey = (codeId?: HexString) => ['idl', codeId];

type UseIdlStorageReturn = {
  idl: string | null;
  saveIdl: (idlContent: string) => void;
  isLoading: boolean;
};

export const useIdlStorage = (codeId?: HexString): UseIdlStorageReturn => {
  const queryClient = useQueryClient();

  const { data: idl = null, isLoading } = useQuery({
    queryKey: getIdlQueryKey(codeId),
    queryFn: () => localStorage.getItem(getIdlStorageKey(codeId!)),
    enabled: !!codeId,
  });

  const { mutate: saveIdl } = useMutation({
    mutationFn: (idlContent: string) => {
      if (!codeId) throw new Error('Code ID is not found');
      localStorage.setItem(getIdlStorageKey(codeId), idlContent);
      return Promise.resolve(idlContent);
    },
    onSuccess: (idlContent) => {
      queryClient.setQueryData(getIdlQueryKey(codeId), idlContent);
    },
    onError: (error) => {
      console.error('Failed to save IDL to localStorage:', error);
    },
  });

  return { idl, saveIdl, isLoading };
};
