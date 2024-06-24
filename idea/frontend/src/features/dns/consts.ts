import { decodeAddress } from '@gear-js/api';
import { z } from 'zod';

import { isAccountAddressValid } from '@/shared/helpers';

import { Values } from './types';

const FIELD_NAME = {
  DNS_NAME: 'name',
  DNS_ADDRESS: 'address',
} as const;

const DEFAULT_VALUES: Values = {
  [FIELD_NAME.DNS_ADDRESS]: '',
  [FIELD_NAME.DNS_NAME]: '',
};

const ADDRESS_SCHEMA = z
  .string()
  .trim()
  .min(0)
  .refine((value) => isAccountAddressValid(value), 'Invalid address')
  .transform((value) => decodeAddress(value));

const domainNameRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_SCHEMA = z.string().trim().regex(domainNameRegex, 'Invalid domain name');

const dnsSchema = z.object({
  [FIELD_NAME.DNS_ADDRESS]: ADDRESS_SCHEMA,
  [FIELD_NAME.DNS_NAME]: NAME_SCHEMA,
});

export type DnsSchema = z.infer<typeof dnsSchema>;

export { FIELD_NAME, DEFAULT_VALUES, ADDRESS_SCHEMA, NAME_SCHEMA, dnsSchema };
