import { isHex } from '@polkadot/util';

const isHexValid = (value: string) => (isHex(value) ? null : 'Value should be hex');

export { isHexValid };
