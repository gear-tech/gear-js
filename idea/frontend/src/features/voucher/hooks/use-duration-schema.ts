import { useApi } from '@gear-js/react-hooks';
import { z } from 'zod';

function useDurationSchema() {
  const { api, isV110Runtime } = useApi();

  const getDurationSchema = () => {
    if (!api) throw new Error('API is not initialized');

    const { minDuration } = api.voucher;

    return z.coerce.number().min(minDuration);
  };

  const getDurationPlaceholderSchema = () => z.coerce.number().transform(() => 0);

  return isV110Runtime ? getDurationSchema() : getDurationPlaceholderSchema();
}

export { useDurationSchema };
