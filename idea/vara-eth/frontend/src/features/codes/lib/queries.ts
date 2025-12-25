import { useQuery } from '@tanstack/react-query';

import { EXPLORER_URL } from '@/shared/config';
import { fetchWithGuard } from '@/shared/helpers';

export const CODE_STATUS = {
  VALIDATION_REQUESTED: 'ValidationRequested',
  VALIDATION_FAILED: 'ValidationFailed',
  VALIDATED: 'Validated',
} as const;

export type Code = {
  id: string;
  status: string;
  createdAt: string;
};

type CodesResponse = {
  data: Code[];
  total: number;
  limit: number;
  offset: number;
};

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

export const useGetCodeByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['codeById', id],
    queryFn: async () => {
      const url = new URL(`${EXPLORER_URL}/codes/${id}`);
      return fetchWithGuard<Code>({ url });
    },
    enabled: !!id,
  });
};
