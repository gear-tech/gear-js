import { useQuery } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';

import { EXPLORER_URL } from '@/shared/config';
import { PaginatedResponse } from '@/shared/types';
import { fetchWithGuard } from '@/shared/utils';

type Transaction = {
  id: HexString;
  contractAddress: HexString;
  selector: string;
  data: HexString;
  sender: HexString;
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
