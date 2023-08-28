import { decodeAddress } from '@gear-js/api';
import { isHex } from '@polkadot/util';

const isHexValid = (value: string) => (isHex(value) ? null : 'Value should be hex');
const isExists = (value: string) => (!value ? 'Field is required' : null);

const isDecimal = (value: string) => {
  const decimalRegex = /^-?\d+\.\d+$/;

  return decimalRegex.test(value);
};

const isAccountAddressValid = (value: string) => {
  try {
    decodeAddress(value);
  } catch (error) {
    return 'Invalid address';
  }
};

export { isHexValid, isExists, isDecimal, isAccountAddressValid };
