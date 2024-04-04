import { decodeAddress } from '@gear-js/api';
import { z } from 'zod';

import { isAccountAddressValid } from '@/shared/helpers';

import { Values } from './types';

const FIELD_NAME = {
  VOUCHER_TYPE: 'type',
  ACCOUNT_ADDRESS: 'address',
  VALUE: 'value',
  DURATION: 'duration',
} as const;

const VOUCHER_TYPE = {
  PROGRAM: 'program',
  MIXED: 'mixed',
  CODE: 'code',
} as const;

const DEFAULT_VALUES: Values = {
  [FIELD_NAME.ACCOUNT_ADDRESS]: '',
  [FIELD_NAME.VALUE]: '',
  [FIELD_NAME.DURATION]: '',
};

const ADDRESS_SCHEMA = z
  .string()
  .trim()
  .min(0)
  .refine((value) => isAccountAddressValid(value), 'Invalid address')
  .transform((value) => decodeAddress(value));

export { FIELD_NAME, VOUCHER_TYPE, DEFAULT_VALUES, ADDRESS_SCHEMA };
