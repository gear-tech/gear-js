import { type DependencyList, type EffectCallback, useEffect, useRef } from 'react';

function useChangeEffect(callback: EffectCallback, dependencies?: DependencyList) {
  const mounted = useRef(false);

  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  useEffect(() => {
    if (mounted.current) return callback();

    mounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}

export { useChangeEffect };
