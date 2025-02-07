import { MaybeHash } from '../types';

export function transformMaybeHash(value: any): MaybeHash {
  if (value == undefined) {
    return null;
  }
  if (value == 'Empty') {
    return null;
  }
  if (typeof value !== 'object') {
    return value;
  }

  return value.Hash as MaybeHash;
}

export function transformMaybeHashes(object: unknown, paths: Array<string>) {
  if (typeof object !== 'object') {
    return object;
  }

  for (const path of paths) {
    object[path] = transformMaybeHash(object[path]);
  }
}
