import {
  bufferToU8a,
  hexToU8a,
  isBuffer,
  isHex,
  isString,
  isU8a,
  stringToHex,
  stringToU8a,
  u8aToHex,
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

export function toU8a(data: any) {
  if (isHex(data)) {
    return hexToU8a(data);
  } else if (isString(data)) {
    return stringToU8a(data);
  } else if (isU8a(data)) {
    return data;
  }
}

export async function fromBytes(type: string, data: any) {
  try {
    const result = await CreateType.fromBytes(
      process.env.WS_PROVIDER,
      type,
      data,
    );
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function toBytes(type: string, data: any) {
  try {
    const bytes = await CreateType.toBytes(process.env.WS_PROVIDER, type, data);
    return bytes;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
