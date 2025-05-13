import { assert } from './assert';
import { HexString } from './types';

export function isHex(value: string): value is HexString {
  return /^(0x)?[0-9a-fA-F]+$/.test(value);
}

export function hexToUint8Array(value: string): Uint8Array {
  assert(isHex(value), 'Invalid hex string');

  const start = value.startsWith('0x') ? 2 : 0;

  const len = value.length - start;

  assert(len % 2 == 0, 'Invalid bytes length');

  const arr = new Uint8Array(len / 2);

  for (let i = start; i < len + start; i += 2) {
    arr[i / 2] = (parseInt(value[i], 16) << 4) | parseInt(value[i + 1], 16);
  }

  return arr;
}
