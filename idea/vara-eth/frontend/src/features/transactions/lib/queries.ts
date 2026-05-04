import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import type { Hex } from 'viem';

import { nodeAtom } from '@/app/store';
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
  const { explorerUrl } = useAtomValue(nodeAtom);
  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  return useQuery({
    queryKey: ['allTransactions', limit, offset, explorerUrl],

    queryFn: () => {
      const url = new URL(`${explorerUrl}/transactions`);

      url.searchParams.set('limit', String(limit));
      url.searchParams.set('offset', String(offset));

      return fetchWithGuard<PaginatedResponse<Transaction>>({ url });
    },

    placeholderData: (previousData) => previousData,
  });
};
