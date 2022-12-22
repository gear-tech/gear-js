import { ProgramMetadata } from './programMetadata';
import { StateMetadata } from './stateMetadata';
import { OldMetadata } from '../types';

export function isOldMeta(arg: unknown): arg is OldMetadata {
  if (typeof arg === 'object') {
    if (Object.hasOwn(arg, 'types')) {
      return true;
    }
  }
  return false;
}

export function isProgramMeta(arg: unknown): arg is ProgramMetadata {
  if (arg instanceof ProgramMetadata) {
    return true;
  }
  return false;
}

export function isStateMeta(arg: unknown): arg is StateMetadata {
  if (arg instanceof StateMetadata) {
    return true;
  }
  return false;
}
