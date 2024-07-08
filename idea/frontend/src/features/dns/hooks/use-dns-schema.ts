import { z } from 'zod';

import { useProgramIdSchema } from '@/hooks';
import { FIELD_NAME, NAME_SCHEMA } from '../consts';
import { getSingleDns } from '../utils';

const useDnsSchema = () => {
  const programIdSchema = useProgramIdSchema([]);

  const dnsNameSchema = NAME_SCHEMA.refine(async (value) => {
    const result = await getSingleDns(value).catch(() => {
      // empty
    });
    return !result;
  }, 'dDNS name already exists');

  const dnsSchema = z.object({
    [FIELD_NAME.DNS_ADDRESS]: programIdSchema,
    [FIELD_NAME.DNS_NAME]: dnsNameSchema,
  });

  return dnsSchema;
};

export { useDnsSchema };
