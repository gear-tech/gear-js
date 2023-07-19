import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

export const useChangeEffect = (callback: EffectCallback, dependencies: DependencyList) => {
  const mounted = useRef(false);

  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  useEffect(() => {
    if (mounted.current) {
      return callback();
    }

    mounted.current = true;
    return undefined;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};
