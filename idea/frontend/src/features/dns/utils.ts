import { HexString } from '@gear-js/api';

import { DEFAULT_LIMIT } from '@/shared/config';
import { fetchWithGuard } from '@/shared/helpers';

import { Dns, DnsParams, DnsResponse } from './types';
import { API_URL } from './consts';

type Genesis = {
  genesis: HexString;
};

const getUrl = (genesis: HexString, path: string) => `${API_URL[genesis as keyof typeof API_URL]}/${path}`;

const getDnsProgramId = async ({ genesis }: Genesis) => {
  const method = 'GET';

  return (await fetchWithGuard<{ contract: HexString }>(getUrl(genesis, 'dns/contract'), { method })).contract;
};

const getDns = ({ genesis, ...params }: DnsParams & Genesis) => {
  const method = 'GET';
  const url = new URL(getUrl(genesis, 'dns'));

  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, String(value)));

  return fetchWithGuard<DnsResponse>(url.toString(), { method });
};

const getSingleDns = ({ genesis, ...params }: ({ address: HexString } | { name: string }) & Genesis) => {
  const method = 'GET';
  const [key, value] = Object.entries(params)[0];
  const url = new URL(getUrl(genesis, `dns/by_${key}/${value}`));

  return fetchWithGuard<Dns>(url.toString(), { method });
};

const getNextPageParam = (lastPage: DnsResponse, allPages: DnsResponse[]) => {
  const totalCount = lastPage.count;
  const lastPageCount = lastPage.data.length;
  const fetchedCount = (allPages.length - 1) * DEFAULT_LIMIT + lastPageCount;

  return fetchedCount < totalCount ? fetchedCount : undefined;
};

export { getDnsProgramId, getDns, getSingleDns, getNextPageParam };
