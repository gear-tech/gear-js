import { useRef, useState, useEffect, useCallback } from 'react';

import { DEFAULT_LIMIT } from 'shared/config';

type Props<T> = {
  fetchData: (params: T, isReset?: boolean) => Promise<void>;
  totalCount: number;
  currentCount: number;
  defaultParams: T;
};

const useDataLoading = <T>({ totalCount, currentCount, defaultParams, fetchData }: Props<T>) => {
  const offset = useRef(0);
  const [params, setParams] = useState(defaultParams);
  const [hasMore, setHasMore] = useState(false);

  const loadData = useCallback(
    async (isReset = false) => {
      if (isReset) {
        offset.current = 0;
      }

      setHasMore(false);

      try {
        await fetchData(
          {
            ...params,
            offset: offset.current,
          },
          isReset,
        );

        offset.current += DEFAULT_LIMIT;
      } catch {
        setHasMore(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params],
  );

  useEffect(() => {
    setHasMore(currentCount < totalCount);
  }, [totalCount, currentCount]);

  useEffect(() => {
    loadData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadData]);

  return { params, hasMore, loadData, changeParams: setParams };
};

export { useDataLoading };
