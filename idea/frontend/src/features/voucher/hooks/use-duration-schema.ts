import { useApi } from '@gear-js/react-hooks';
import { z } from 'zod';

function useDurationSchema() {
  const { api, isV110Runtime } = useApi();

  const getDurationSchema = () => {
    if (!api) throw new Error('API is not initialized');

    const { minDuration, maxDuration } = api.voucher;

    return z.coerce.number().min(minDuration).max(maxDuration).int();
  };

  // TODO: probably should be done by shoudlUnregister?
  const getDurationPlaceholderSchema = () => z.coerce.number().transform(() => 0);

  return isV110Runtime ? getDurationSchema() : getDurationPlaceholderSchema();
}

export { useDurationSchema };
