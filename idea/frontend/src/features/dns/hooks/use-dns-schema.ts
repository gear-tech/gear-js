import { z } from 'zod';

import { useProgramIdSchema } from '@/hooks';
import { FIELD_NAME, NAME_SCHEMA } from '../consts';
import { getSingleDns } from '../utils';

const useDnsSchema = (isEditMode?: boolean) => {
  const programIdSchema = useProgramIdSchema([]);

  const dnsNameSchema = isEditMode
    ? NAME_SCHEMA
    : NAME_SCHEMA.refine(async (name) => {
        const result = await getSingleDns({ name }).catch(() => {
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
