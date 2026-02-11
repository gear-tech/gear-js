import { useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';

import { EXPLORER_URL } from '@/shared/config';
import { PaginatedResponse } from '@/shared/types';
import { fetchWithGuard } from '@/shared/utils';

import { Code, getCode } from './requests';

export const CODE_STATUS = {
  VALIDATION_REQUESTED: 'ValidationRequested',
  VALIDATION_FAILED: 'ValidationFailed',
  VALIDATED: 'Validated',
} as const;

type CodesResponse = PaginatedResponse<Code>;

export const useGetAllCodesQuery = (page: number, pageSize: number) => {
  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  return useQuery({
    queryKey: ['allCodes', limit, offset],
    queryFn: async () => {
      const url = new URL(`${EXPLORER_URL}/codes`);
      url.searchParams.set('limit', String(limit));
      url.searchParams.set('offset', String(offset));

      return fetchWithGuard<CodesResponse>({ url });
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useGetCodeByIdQuery = (id: Hex | undefined) => {
  return useQuery({
    queryKey: ['codeById', id],
    queryFn: () => getCode(id!),
    enabled: Boolean(id),
  });
};
