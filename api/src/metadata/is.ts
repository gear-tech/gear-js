import { OldMetadata } from '../types';
import { ProgramMetadata } from './programMetadata';
import { StateMetadata } from './stateMetadata';

export function isOldMeta(arg: unknown): arg is OldMetadata {
  if (typeof arg === 'object') {
    if (Object.hasOwn(arg, 'types')) {
      return true;
    }
  }
  return false;
}

export function isProgramMeta(arg: unknown): arg is ProgramMetadata {
  if (typeof arg !== 'object') {
    return false;
  }
  // It's a temporary solution until problem with instanceof is solved on the frontend
  return Object.getPrototypeOf(arg).constructor.toString() === ProgramMetadata.prototype.constructor.toString();
}

export function isStateMeta(arg: unknown): arg is StateMetadata {
  if (typeof arg !== 'object') {
    return false;
  }
  // It's a temporary solution until problem with instanceof is solved on the frontend
  return Object.getPrototypeOf(arg).constructor.toString() === StateMetadata.prototype.constructor.toString();
}
