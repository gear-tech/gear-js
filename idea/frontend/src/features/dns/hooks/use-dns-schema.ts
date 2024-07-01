import { useProgramIdSchema } from '@/hooks';
import { z } from 'zod';
import { FIELD_NAME, NAME_SCHEMA } from '../consts';

const useDnsSchema = () => {
  const programIdSchema = useProgramIdSchema([]);

  const dnsSchema = z.object({
    [FIELD_NAME.DNS_ADDRESS]: programIdSchema,
    [FIELD_NAME.DNS_NAME]: NAME_SCHEMA,
  });

  return dnsSchema;
};

export { useDnsSchema };
