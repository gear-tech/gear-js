import { queryOptions, useQuery } from '@tanstack/react-query';
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

type AllProgramsParams = {
  explorerUrl: string;
  page: number;
  pageSize: number;
  codeId?: Hex;
};

const ALL_PROGRAMS_STALE_TIME = 60 * 1000;

const getProgramsLimitOffset = ({ page, pageSize }: Pick<AllProgramsParams, 'page' | 'pageSize'>) => ({
  limit: pageSize,
  offset: Math.max(0, (page - 1) * pageSize),
});

const getAllProgramsQueryKey = ({ explorerUrl, page, pageSize, codeId }: AllProgramsParams) => {
  const { limit, offset } = getProgramsLimitOffset({ page, pageSize });
  return ['allPrograms', limit, offset, codeId, explorerUrl] as const;
};

const getAllPrograms = async ({ explorerUrl, page, pageSize, codeId }: AllProgramsParams) => {
  const { limit, offset } = getProgramsLimitOffset({ page, pageSize });
  const url = new URL(`${explorerUrl}/programs`);

  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));

  if (codeId) url.searchParams.set('codeId', codeId);

  return fetchWithGuard<ProgramsResponse>({ url });
};

export const getAllProgramsQueryOptions = ({ explorerUrl, page, pageSize, codeId }: AllProgramsParams) =>
  queryOptions({
    queryKey: getAllProgramsQueryKey({ explorerUrl, page, pageSize, codeId }),
    queryFn: () => getAllPrograms({ explorerUrl, page, pageSize, codeId }),
    staleTime: ALL_PROGRAMS_STALE_TIME,
    placeholderData: (previousData: ProgramsResponse | undefined) => previousData,
  });

export const useGetAllProgramsQuery = (
  page: number,
  pageSize: number,
  codeId?: Hex,
  getPlaceholder?: () => ProgramsResponse | undefined,
) => {
  const { explorerUrl } = useAtomValue(nodeAtom);

  return useQuery({
    ...getAllProgramsQueryOptions({ explorerUrl, page, pageSize, codeId }),
    placeholderData: (prev: ProgramsResponse | undefined) => getPlaceholder?.() ?? prev,
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
