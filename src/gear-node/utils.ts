import { ApiPromise } from '@polkadot/api';
import {
  bufferToU8a,
  hexToString,
  isBuffer,
  isHex,
  isString,
  isU8a,
  stringToHex,
  u8aToHex,
  u8aToString,
} from '@polkadot/util';

export async function getNextBlock(api: ApiPromise, hash: string) {
  const block = await api.rpc.chain.getHeader(hash);
  const blockNumber = block.number.toNumber();
  const nextBlockHash = await api.rpc.chain.getBlockHash(blockNumber + 1);
  return nextBlockHash;
}

export function toHex(data) {
  if (!isHex(data) && isString(data)) {
    return stringToHex(data);
  } else if (isHex(data)) {
    return data;
  } else if (isU8a(data)) {
    return u8aToHex(data);
  } else if (isBuffer(data)) {
    return u8aToHex(bufferToU8a(data));
  }
}

export function valueToString(data) {
  if (isHex(data)) {
    return hexToString(data);
  } else if (isString(data)) {
    return data;
  } else if (isU8a(data)) {
    return u8aToString(data);
  }
}
