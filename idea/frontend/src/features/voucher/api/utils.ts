import { DEFAULT_LIMIT } from '@/shared/config';
import { fetchWithGuard } from '@/shared/helpers';

import { VouchersParameters, VouchersResponse } from './types';

const getVouchers = (url: string, params: VouchersParameters) => {
  const method = 'POST';
  const body = JSON.stringify(params);
  const headers = { 'Content-Type': 'application/json' };

  return fetchWithGuard<VouchersResponse>(`${url}/vouchers`, { method, body, headers });
};

const getNextPageParam = (lastPage: VouchersResponse, allPages: VouchersResponse[]) => {
  const totalCount = lastPage.count;
  const lastPageCount = lastPage.vouchers.length;
  const fetchedCount = (allPages.length - 1) * DEFAULT_LIMIT + lastPageCount;

  return fetchedCount < totalCount ? fetchedCount : undefined;
};

export { getVouchers, getNextPageParam };
