import { assert } from './assert.js';
import { HexString } from './types/index.js';

export function isHex(value: string): value is HexString {
  return /^(0x)?[0-9a-fA-F]+$/.test(value);
}

export function hexToUint8Array(value: string): Uint8Array {
  assert(isHex(value), 'Invalid hex string');

  const prefixLen = value.startsWith('0x') ? 2 : 0;

  const len = value.length - prefixLen;

  assert(len % 2 == 0, 'Invalid bytes length');

  const arr = new Uint8Array(len / 2);

  for (let i = prefixLen; i < value.length; i += 2) {
    const index = (i - prefixLen) / 2;
    arr[index] = (parseInt(value[i], 16) << 4) | parseInt(value[i + 1], 16);
  }

  return arr;
}
