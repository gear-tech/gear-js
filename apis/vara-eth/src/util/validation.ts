import { isHexString } from '@ethereumjs/util';

export function isActorId(value: string): boolean {
  if (!isHexString(value)) {
    return false;
  }

  if (value.length !== 42) {
    return false;
  }

  return true;
}
