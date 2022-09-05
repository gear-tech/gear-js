import { useRef, useState, useEffect, useCallback } from 'react';

import { DEFAULT_LIMIT } from 'shared/config';

type Props<T> = {
  fetchData: (params: T, isReset?: boolean) => Promise<void>;
  defaultParams: T;
};

const useDataLoading = <T>({ defaultParams, fetchData }: Props<T>) => {
  const offset = useRef(0);
  const [params, setParams] = useState(defaultParams);

  const loadData = useCallback(
    (isReset = false) => {
      if (isReset) {
        offset.current = 0;
      }

      fetchData(
        {
          ...params,
          offset: offset.current,
        },
        isReset,
      ).then(() => {
        offset.current += DEFAULT_LIMIT;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params],
  );

  useEffect(() => {
    loadData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadData]);

  return { params, loadData, changeParams: setParams };
};

export { useDataLoading };
