import { useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';

import type { Code } from '@/features/codes/lib/requests';
import { EXPLORER_URL } from '@/shared/config';
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
  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  return useQuery({
    queryKey: ['allPrograms', limit, offset, codeId],
    queryFn: async () => {
      const url = new URL(`${EXPLORER_URL}/programs`);
      url.searchParams.set('limit', String(limit));
      url.searchParams.set('offset', String(offset));

      if (codeId) url.searchParams.set('codeId', codeId);

      return fetchWithGuard<ProgramsResponse>({ url });
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useGetProgramByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['programById', id],
    queryFn: async () => {
      const url = new URL(`${EXPLORER_URL}/programs/${id}`);
      return fetchWithGuard<Program>({ url });
    },
    enabled: !!id,
  });
};
