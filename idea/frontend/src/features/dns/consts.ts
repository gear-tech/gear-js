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

const domainNameRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_SCHEMA = z.string().trim().regex(domainNameRegex, 'Invalid domain name');

export { FIELD_NAME, DEFAULT_VALUES, NAME_SCHEMA };
