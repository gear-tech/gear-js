import { isAccountAddressValid } from '@/shared/helpers';
import { decodeAddress } from '@gear-js/api';
import { z } from 'zod';

const DEFAULT_VALUES = {
  address: '',
  value: '',
  duration: '',
  isCodeUploadEnabled: false,
};

const ADDRESS_SCHEMA = z
  .string()
  .trim()
  .min(0)
  .refine((value) => isAccountAddressValid(value), 'Invalid address')
  .transform((value) => decodeAddress(value));

export { DEFAULT_VALUES, ADDRESS_SCHEMA };
