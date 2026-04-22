import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import type { Hex } from 'viem';

import { nodeAtom } from '@/app/store';
import type { Code } from '@/features/codes/lib/requests';
import type { PaginatedResponse } from '@/shared/types';
import { fetchWithGuard } from '@/shared/utils';

export type Program = {
  id: Hex;
  blockNumber: string;
  createdAt: string;
  txHash: Hex;
  abiInterfaceAddress?: string | null;
  code?: Code;
};

export type ProgramsResponse = PaginatedResponse<Program>;

export const useGetAllProgramsQuery = (page: number, pageSize: number, codeId?: Hex) => {
  const { explorerUrl } = useAtomValue(nodeAtom);
  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  return useQuery({
    queryKey: ['allPrograms', limit, offset, codeId, explorerUrl],
    queryFn: async () => {
      const url = new URL(`${explorerUrl}/programs`);
      url.searchParams.set('limit', String(limit));
      url.searchParams.set('offset', String(offset));

      if (codeId) url.searchParams.set('codeId', codeId);

      return fetchWithGuard<ProgramsResponse>({ url });
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useGetProgramByIdQuery = (id: string) => {
  const { explorerUrl } = useAtomValue(nodeAtom);

  return useQuery({
    queryKey: ['programById', id, explorerUrl],
    queryFn: async () => {
      const url = new URL(`${explorerUrl}/programs/${id}`);
      return fetchWithGuard<Program>({ url });
    },
    enabled: !!id,
  });
};
