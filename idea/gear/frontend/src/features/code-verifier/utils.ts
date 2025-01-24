import { isHex } from '@polkadot/util';

const isCodeIdValid = (value: string) => isHex(value, 256);

export { isCodeIdValid };
