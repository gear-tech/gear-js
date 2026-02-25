import { useApi } from '@gear-js/react-hooks';
import { z } from 'zod';

type DurationSchema = ReturnType<typeof z.coerce.number<string>>;

function useDurationSchema(): DurationSchema {
  const { api } = useApi();

  const getDurationSchema = () => {
    if (!api) throw new Error('API is not initialized');

    const { minDuration, maxDuration } = api.voucher;

    return z.coerce.number<string>().min(minDuration).max(maxDuration).int();
  };

  return getDurationSchema();
}

export { useDurationSchema };
