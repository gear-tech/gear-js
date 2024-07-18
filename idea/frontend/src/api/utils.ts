import { DEFAULT_LIMIT } from '@/shared/config';

import { PaginationResponse } from './types';

const getNextPageParam = <T>({ result, count }: PaginationResponse<T>, allPages: PaginationResponse<T>[]) => {
  const lastPageCount = result.length;
  const fetchedCount = (allPages.length - 1) * DEFAULT_LIMIT + lastPageCount;

  return fetchedCount < count ? fetchedCount : undefined;
};

const select = <T>({ pages }: { pages: PaginationResponse<T>[] }) => ({
  result: pages.flatMap((page) => page.result),
  count: pages[0].count,
});

export { getNextPageParam, select };
