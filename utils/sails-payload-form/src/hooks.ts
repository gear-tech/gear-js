import { type DependencyList, type EffectCallback, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

import type { PayloadValue } from './types';

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
  }, dependencies);
}

function useSetPayloadValue(name: string, value: PayloadValue, dependency: unknown) {
  const { setValue } = useFormContext();

  useChangeEffect(() => {
    setValue(name, value);
  }, [dependency]);
}

export { useSetPayloadValue };
