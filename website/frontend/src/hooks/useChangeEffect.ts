import { useEffect, useRef } from 'react';

export const useChangeEffect = (callback: () => void, dependencies?: unknown[]) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      callback();
    }

    return () => {
      isMounted.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};
