import { useApi } from '@gear-js/react-hooks';
import { z } from 'zod';

import { useProgramIdSchema } from '@/hooks';

import { FIELD_NAME, NAME_SCHEMA } from '../consts';
import { getSingleDns } from '../utils';

const useDnsSchema = (isEditMode?: boolean) => {
  const { api, isApiReady } = useApi();
  const programIdSchema = useProgramIdSchema([]);

  const getNameSchema = () => {
    if (!isApiReady) return z.string();
    const genesis = api.genesisHash.toHex();

    return isEditMode
      ? NAME_SCHEMA
      : NAME_SCHEMA.refine(async (name) => {
          const result = await getSingleDns({ name, genesis }).catch(() => {});
          return !result;
        }, 'dDNS name already exists');
  };

  const dnsSchema = z.object({
    [FIELD_NAME.DNS_ADDRESS]: programIdSchema,
    [FIELD_NAME.DNS_NAME]: getNameSchema(),
  });

  return dnsSchema;
};

export { useDnsSchema };
