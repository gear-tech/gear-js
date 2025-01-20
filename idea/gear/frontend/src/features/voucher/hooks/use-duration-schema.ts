import { useApi } from '@gear-js/react-hooks';
import { z } from 'zod';

function useDurationSchema() {
  const { api } = useApi();

  const getDurationSchema = () => {
    if (!api) throw new Error('API is not initialized');

    const { minDuration, maxDuration } = api.voucher;

    return z.coerce.number().min(minDuration).max(maxDuration).int();
  };

  return getDurationSchema();
}

export { useDurationSchema };
