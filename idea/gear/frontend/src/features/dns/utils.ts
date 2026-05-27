import type { HexString } from '@gear-js/api';

import { DEFAULT_LIMIT } from '@/shared/config';
import { fetchWithGuard } from '@/shared/helpers';

import { DNS_API_URL } from './consts';
import type { Dns, DnsParams, DnsResponse } from './types';

type Genesis = {
  genesis: HexString;
};

const getUrl = (genesis: HexString, path: string) => `${DNS_API_URL[genesis as keyof typeof DNS_API_URL]}/${path}`;

const getDnsProgramId = async ({ genesis }: Genesis) => {
  const url = new URL(getUrl(genesis, 'dns/contract'));
  url.searchParams.set('genesis', genesis);
  return (await fetchWithGuard<{ contract: HexString }>({ url })).contract;
};

const getDns = ({ genesis, ...params }: DnsParams & Genesis) => {
  const url = new URL(getUrl(genesis, 'dns'));

  Object.entries({ ...params, genesis }).forEach(([key, value]) => void url.searchParams.append(key, String(value)));

  return fetchWithGuard<DnsResponse>({ url });
};

const getSingleDns = ({ genesis, ...params }: ({ address: HexString } | { name: string }) & Genesis) => {
  const [key, value] = Object.entries(params)[0];
  const url = new URL(getUrl(genesis, `dns/by_${key}/${value}`));
  url.searchParams.set('genesis', genesis);

  return fetchWithGuard<Dns>({ url });
};

const getNextPageParam = (lastPage: DnsResponse, allPages: DnsResponse[]) => {
  const totalCount = lastPage.count;
  const lastPageCount = lastPage.data.length;
  const fetchedCount = (allPages.length - 1) * DEFAULT_LIMIT + lastPageCount;

  return fetchedCount < totalCount ? fetchedCount : undefined;
};

export { getDns, getDnsProgramId, getNextPageParam, getSingleDns };
