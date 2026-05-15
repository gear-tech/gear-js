import { useEffect } from 'react';

import { getNeighbourPages } from '@/shared/utils/pagination';

type UsePaginationEffectsParams = {
  page: number;
  pageSize: number;
  totalPages: number;
  setPage: (updater: (page: number) => number) => void;
  prefetchPage?: (params: PaginationPrefetchParams) => void | Promise<void>;
};

type PaginationPrefetchParams = {
  page: number;
  pageSize: number;
};

const usePaginationEffects = ({ page, pageSize, totalPages, setPage, prefetchPage }: UsePaginationEffectsParams) => {
  useEffect(() => {
    const lastAvailablePage = Math.max(1, totalPages);
    if (page > lastAvailablePage) setPage(() => lastAvailablePage);
  }, [page, setPage, totalPages]);

  useEffect(() => {
    if (!prefetchPage || totalPages <= 1) return;

    const neighbourPages = getNeighbourPages({ page, totalPages });
    neighbourPages.forEach((neighbourPage) => {
      void prefetchPage({ page: neighbourPage, pageSize });
    });
  }, [page, pageSize, prefetchPage, totalPages]);
};

export type { PaginationPrefetchParams, UsePaginationEffectsParams };
export { usePaginationEffects };
