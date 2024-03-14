import { decodeAddress } from '@gear-js/api';
import { isHex } from '@polkadot/util';

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

export { isHexValid, isExists, isAccountAddressValid };
