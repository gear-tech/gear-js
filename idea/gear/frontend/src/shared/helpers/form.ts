import { decodeAddress } from '@gear-js/api';
import { isHex } from '@polkadot/util';
import { z } from 'zod';

const isHexValid = (value: string) => (isHex(value) ? true : 'Value should be hex');
const isExists = (value: string) => (!value ? 'Field is required' : null);

const isAccountAddressValid = (value = '') => {
  try {
    decodeAddress(value);
    return true;
  } catch {
    return false;
  }
};

const isNumeric = (value: string) => {
  const digitsRegex = /^\d+$/;

  return digitsRegex.test(value);
};

const asOptionalField = <T extends z.ZodTypeAny>(schema: T) => schema.or(z.literal(''));

export { isHexValid, isExists, isAccountAddressValid, isNumeric, asOptionalField };
