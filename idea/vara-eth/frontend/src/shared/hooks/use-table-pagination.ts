import { type QueryKey, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import { COLLAPSED_PAGE_SIZE, OPEN_PAGE_SIZE } from '@/shared/config';
import { getCachedPlaceholder } from '@/shared/utils/pagination';

type PaginationState = {
  page: number;
  pageSize: number;
};

type UseTablePaginationParams = {
  effectivePageSize: number;
  initialPage?: number;
  smallPageSize?: number;
  largePageSize?: number;
  getQueryOptions?: (params: PaginationState) => PaginatedQueryOptions;
};

type PaginatedQueryOptions = {
  queryKey: QueryKey;
};

const useTablePagination = ({
  effectivePageSize,
  initialPage = 1,
  smallPageSize = OPEN_PAGE_SIZE,
  largePageSize = COLLAPSED_PAGE_SIZE,
  getQueryOptions,
}: UseTablePaginationParams) => {
  const queryClient = useQueryClient();
  const [offset, setOffset] = useState(() => Math.max(0, (initialPage - 1) * effectivePageSize));
  const pagination = useMemo<PaginationState>(
    () => ({
      pageSize: effectivePageSize,
      page: Math.floor(offset / effectivePageSize) + 1,
    }),
    [effectivePageSize, offset],
  );

  const setPage = useCallback(
    (updater: (page: number) => number) => {
      setOffset((prevOffset) => {
        const currentPage = Math.floor(prevOffset / effectivePageSize) + 1;
        const nextPage = Math.max(1, updater(currentPage));
        return (nextPage - 1) * effectivePageSize;
      });
    },
    [effectivePageSize],
  );

  // Warm React Query cache for nearby pages to make navigation instant.
  const prefetchPage = useCallback(
    ({ page, pageSize }: PaginationState) => {
      const options = getQueryOptions?.({ page, pageSize });
      if (!options) return;
      return queryClient.prefetchQuery(options as never);
    },
    [getQueryOptions, queryClient],
  );

  // Reuse cached entries when page size toggles (open/collapsed table modes).
  const getPlaceholder = useCallback(<TEntry extends { data: unknown[] }>(): TEntry | undefined => {
    if (!getQueryOptions) return undefined;

    return getCachedPlaceholder<TEntry>({
      page: pagination.page,
      pageSize: pagination.pageSize,
      smallPageSize,
      largePageSize,
      getCache: (page, pageSize) => {
        const options = getQueryOptions({ page, pageSize });
        return queryClient.getQueryData<TEntry>(options.queryKey);
      },
    });
  }, [getQueryOptions, pagination.page, pagination.pageSize, queryClient, smallPageSize, largePageSize]);

  return { pagination, setPage, prefetchPage, getPlaceholder };
};

export type { PaginatedQueryOptions, PaginationState, UseTablePaginationParams };
export { useTablePagination };
