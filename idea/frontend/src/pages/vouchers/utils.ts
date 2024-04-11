import { VOUCHERS_API_URL } from '@/shared/config';

import { PAGE_SIZE } from './consts';
import { VouchersResponse } from './types';

const fetchWithGuard = async <T extends object>(...args: Parameters<typeof fetch>) => {
  const response = await fetch(...args);

  if (!response.ok) throw new Error(response.statusText);

  return response.json() as T;
};

const getVouchers = (params: { offset: number; limit: number; query: string }) => {
  const url = `${VOUCHERS_API_URL}/vouchers`;
  const method = 'POST';
  const body = JSON.stringify(params);
  const headers = { 'Content-Type': 'application/json' };

  return fetchWithGuard<VouchersResponse>(url, { method, body, headers });
};

const getNextPageParam = (lastPage: VouchersResponse, allPages: VouchersResponse[]) => {
  const totalCount = lastPage.count;
  const lastPageCount = lastPage.vouchers.length;
  const fetchedCount = (allPages.length - 1) * PAGE_SIZE + lastPageCount;

  return fetchedCount < totalCount ? fetchedCount : undefined;
};

export { getVouchers, getNextPageParam };
