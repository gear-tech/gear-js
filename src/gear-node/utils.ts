import { ApiPromise } from '@polkadot/api';
import {
  bufferToU8a,
  hexToString,
  hexToU8a,
  isBuffer,
  isHex,
  isString,
  isU8a,
  stringToHex,
  stringToU8a,
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
  if (isHex(data)) {
    return data;
  } else if (isString(data)) {
    return stringToHex(data);
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

export function toU8a(data: any) {
  if (isHex(data)) {
    return hexToU8a(data);
  } else if (isString(data)) {
    return stringToU8a(data);
  } else if (isU8a(data)) {
    return data;
  }
}

export function toBytes(api: ApiPromise, type: string, data: any) {
  if (type && data) {
    if (type === 'bytes') {
      return api.createType('Bytes', data);
    } else if (['utf8', 'utf-8'].indexOf(type) !== -1) {
      return api.createType('Bytes', Array.from(toU8a(data)));
    } else if (['i32', 'i64', 'f32', 'f64'].indexOf(type) !== -1) {
      return api.createType(
        'Bytes',
        Array.from(this.api.createType(type, data).toU8a()),
      );
    }
  }
}
