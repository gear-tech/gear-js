import { queryOptions, useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import type { Hex } from 'viem';

import { nodeAtom } from '@/app/store';
import type { PaginatedResponse } from '@/shared/types';
import { fetchWithGuard } from '@/shared/utils';

import { type Code, getCode } from './requests';

export const CODE_STATUS = {
  VALIDATION_REQUESTED: 'ValidationRequested',
  VALIDATION_FAILED: 'ValidationFailed',
  VALIDATED: 'Validated',
} as const;

export type CodesResponse = PaginatedResponse<Code>;

type AllCodesParams = {
  explorerUrl: string;
  page: number;
  pageSize: number;
};

const ALL_CODES_STALE_TIME = 60 * 1000;

const getCodesLimitOffset = ({ page, pageSize }: Pick<AllCodesParams, 'page' | 'pageSize'>) => ({
  limit: pageSize,
  offset: Math.max(0, (page - 1) * pageSize),
});

const getAllCodesQueryKey = ({ explorerUrl, page, pageSize }: AllCodesParams) => {
  const { limit, offset } = getCodesLimitOffset({ page, pageSize });
  return ['allCodes', limit, offset, explorerUrl] as const;
};

const getAllCodes = async ({ explorerUrl, page, pageSize }: AllCodesParams) => {
  const { limit, offset } = getCodesLimitOffset({ page, pageSize });

  const url = new URL(`${explorerUrl}/codes`);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));

  return fetchWithGuard<CodesResponse>({ url });
};

export const getAllCodesQueryOptions = ({ explorerUrl, page, pageSize }: AllCodesParams) =>
  queryOptions({
    queryKey: getAllCodesQueryKey({ explorerUrl, page, pageSize }),
    queryFn: () => getAllCodes({ explorerUrl, page, pageSize }),
    staleTime: ALL_CODES_STALE_TIME,
    placeholderData: (previousData: CodesResponse | undefined) => previousData,
  });

export const useGetAllCodesQuery = (
  page: number,
  pageSize: number,
  getPlaceholder?: () => CodesResponse | undefined,
) => {
  const { explorerUrl } = useAtomValue(nodeAtom);

  return useQuery({
    ...getAllCodesQueryOptions({ explorerUrl, page, pageSize }),
    placeholderData: (prev: CodesResponse | undefined) => getPlaceholder?.() ?? prev,
  });
};

export const useGetCodeByIdQuery = (id: Hex | undefined) => {
  const { explorerUrl } = useAtomValue(nodeAtom);

  return useQuery({
    queryKey: ['codeById', id, explorerUrl],
    queryFn: () => getCode(explorerUrl, id!),
    enabled: Boolean(id),
  });
};
