type TotalPagesParams = {
  totalItems: number;
  pageSize: number;
};

type NeighbourPagesParams = {
  page: number;
  totalPages: number;
};

type GetCachedPlaceholderParams<TEntry extends { data: unknown[] }> = {
  page: number;
  pageSize: number;
  smallPageSize: number;
  largePageSize: number;
  getCache: (page: number, pageSize: number) => TEntry | undefined;
};

const getTotalPages = ({ totalItems, pageSize }: TotalPagesParams) =>
  totalItems ? Math.ceil(totalItems / pageSize) : 1;

const getNeighbourPages = ({ page, totalPages }: NeighbourPagesParams) =>
  [page - 1, page + 1].filter((value) => value >= 1 && value <= totalPages);

/**
 * Builds a placeholder from already-cached entries when pageSize changes between
 * smallPageSize and largePageSize (where largePageSize is an exact multiple of smallPageSize).
 *
 * Collapsing (small→large): page N at largeSize = pages (N-1)*factor+1..N*factor at smallSize.
 * Expanding  (large→small): page N at smallSize = slice of page ⌈N/factor⌉ at largeSize.
 */
const getCachedPlaceholder = <TEntry extends { data: unknown[] }>({
  page,
  pageSize,
  smallPageSize,
  largePageSize,
  getCache,
}: GetCachedPlaceholderParams<TEntry>): TEntry | undefined => {
  const factor = largePageSize / smallPageSize;

  if (pageSize === largePageSize) {
    const firstOldPage = (page - 1) * factor + 1;
    const sourceEntries: TEntry[] = [];

    for (let i = 0; i < factor; i++) {
      const entry = getCache(firstOldPage + i, smallPageSize);
      if (!entry) return undefined;
      sourceEntries.push(entry);
    }

    if (!sourceEntries.length) return undefined;

    const [base] = sourceEntries;
    return { ...base, data: sourceEntries.flatMap((entry) => entry.data).slice(0, largePageSize) } as TEntry;
  }

  if (pageSize === smallPageSize) {
    const oldPage = Math.ceil(page / factor);
    const entry = getCache(oldPage, largePageSize);
    if (!entry) return undefined;
    const sliceStart = ((page - 1) % factor) * pageSize;
    if (entry.data.length <= sliceStart) return undefined;
    return { ...entry, data: entry.data.slice(sliceStart, sliceStart + pageSize) } as TEntry;
  }

  return undefined;
};

export type { GetCachedPlaceholderParams, NeighbourPagesParams, TotalPagesParams };
export { getCachedPlaceholder, getNeighbourPages, getTotalPages };
