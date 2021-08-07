import { ApiPromise, WsProvider } from '@polkadot/api';
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
const CreateType = require('create-type');

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

export async function fromBytes(api: ApiPromise, type: string, payload: any) {
  const result = await CreateType.fromBytes(
    process.env.WS_PROVIDER,
    type,
    payload,
  );
  return result;
}

export async function toBytes(api: ApiPromise, type: string, data: any) {
  if (type && data) {
    if (type === 'bytes') {
      return api.createType('Bytes', data);
    } else if (['utf8', 'utf-8'].indexOf(type) !== -1) {
      return api.createType('Bytes', Array.from(toU8a(data)));
    } else if (type === 'i32' || type === 'i64') {
      return api.createType(
        'Bytes',
        Array.from(api.createType(type, data).toU8a()),
      );
    } else if (type === 'u32' || type === 'u64') {
      return api.createType(
        'Bytes',
        Array.from(api.createType(type, data).toU8a()),
      );
    } else {
      const bytes = await CreateType.toBytes(
        process.env.WS_PROVIDER,
        type,
        data,
      );
      return bytes;
    }
  }
}
