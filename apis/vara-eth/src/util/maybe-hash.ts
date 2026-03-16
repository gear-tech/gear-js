import { Hash } from 'viem';

import { MaybeHash } from '../types';

export function transformMaybeHash(value: any): MaybeHash {
  if (value == undefined) {
    return null;
  }
  if (value === 'Empty') {
    return null;
  }
  if (typeof value === 'string') {
    return value as Hash;
  }
  if (typeof value !== 'object') {
    throw new Error(`Unexpected MaybeHash value: ${value}`);
  }
  return value.Hash as MaybeHash;
}

export function transformMaybeHashes(object: unknown, paths: Array<string>) {
  if (typeof object !== 'object') {
    return object;
  }

  for (const path of paths) {
    Object.assign(object as any, { [path]: transformMaybeHash((object as any)[path]) });
  }
}
