import { DEFAULT_LIMIT } from '@/shared/config';
import { fetchWithGuard } from '@/shared/helpers';

import { DnsParams, DnsResponse } from './types';
import { DNS_API_URL } from './consts';

const getDns = (params: DnsParams) => {
  const method = 'GET';
  const url = new URL(`${DNS_API_URL}/dns`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, String(value)));
  return fetchWithGuard<DnsResponse>(url.toString(), { method });
};

const getNextPageParam = (lastPage: DnsResponse, allPages: DnsResponse[]) => {
  const totalCount = lastPage.count;
  const lastPageCount = lastPage.data.length;
  const fetchedCount = (allPages.length - 1) * DEFAULT_LIMIT + lastPageCount;

  return fetchedCount < totalCount ? fetchedCount : undefined;
};

export { getDns, getNextPageParam };
