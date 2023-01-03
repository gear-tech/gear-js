import { isHex } from '@polkadot/util';

export const isExists = (value: string) => (!value ? 'Field is required' : null);
export const isHexValue = (value: string) => (!isHex(value) ? 'String must be in Hex format' : null);

export const hexRequired = (value: string) =>
  !value ? 'Field is required' : !isHex(value) ? 'String must be in Hex format' : null;
