import { useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';

import { EXPLORER_URL } from '@/shared/config';
import type { PaginatedResponse } from '@/shared/types';
import { fetchWithGuard } from '@/shared/utils';

type Transaction = {
  id: Hex;
  contractAddress: Hex;
  selector: string;
  data: Hex;
  sender: Hex;
  blockNumber: string;
  createdAt: string;
};

export const useGetAllTransactionsQuery = (page: number, pageSize: number) => {
  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  return useQuery({
    queryKey: ['allTransactions', limit, offset],

    queryFn: () => {
      const url = new URL(`${EXPLORER_URL}/transactions`);

      url.searchParams.set('limit', String(limit));
      url.searchParams.set('offset', String(offset));

      return fetchWithGuard<PaginatedResponse<Transaction>>({ url });
    },

    placeholderData: (previousData) => previousData,
  });
};
