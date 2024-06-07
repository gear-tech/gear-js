import { useFormContext } from 'react-hook-form';

import { useChangeEffect } from '@/hooks';

import { PayloadValue } from '../types';

function useSetPayloadValue(name: string, value: PayloadValue, dependency: unknown) {
  const { setValue } = useFormContext();

  useChangeEffect(() => {
    setValue(name, value);
  }, [dependency]);
}

export { useSetPayloadValue };
