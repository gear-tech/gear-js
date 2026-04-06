import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import type { Hex } from 'viem';

import { nodeAtom } from '@/app/store/node';
import type { PaginatedResponse } from '@/shared/types';
import { fetchWithGuard } from '@/shared/utils';

import { type Code, getCode } from './requests';

export const CODE_STATUS = {
  VALIDATION_REQUESTED: 'ValidationRequested',
  VALIDATION_FAILED: 'ValidationFailed',
  VALIDATED: 'Validated',
} as const;

type CodesResponse = PaginatedResponse<Code>;

export const useGetAllCodesQuery = (page: number, pageSize: number) => {
  const { explorerUrl } = useAtomValue(nodeAtom);
  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  return useQuery({
    queryKey: ['allCodes', limit, offset, explorerUrl],
    queryFn: async () => {
      const url = new URL(`${explorerUrl}/codes`);
      url.searchParams.set('limit', String(limit));
      url.searchParams.set('offset', String(offset));

      return fetchWithGuard<CodesResponse>({ url });
    },
    placeholderData: (previousData) => previousData,
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
