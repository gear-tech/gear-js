import { DEFAULT_LIMIT } from '@/shared/config';

import { DnsParams, DnsResponse } from './types';

const fetchWithGuard = async <T extends object>(...args: Parameters<typeof fetch>) => {
  const response = await fetch(...args);

  if (!response.ok) throw new Error(response.statusText);

  return response.json() as T;
};

const getDns = (url: string, params: DnsParams) => {
  const method = 'GET';
  const queryParams = new URLSearchParams(params as unknown as Record<string, string>);

  return fetchWithGuard<DnsResponse>(`${url}/dns?${queryParams}`, { method });
};

const getNextPageParam = (lastPage: DnsResponse, allPages: DnsResponse[]) => {
  const totalCount = lastPage.count;
  const lastPageCount = lastPage.data.length;
  const fetchedCount = (allPages.length - 1) * DEFAULT_LIMIT + lastPageCount;

  return fetchedCount < totalCount ? fetchedCount : undefined;
};

export { getDns, getNextPageParam };
