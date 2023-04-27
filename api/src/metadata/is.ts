import { ProgramMetadata } from './programMetadata';
import { StateMetadata } from './stateMetadata';

export function isProgramMeta(arg: unknown): arg is ProgramMetadata {
  if (typeof arg !== 'object') {
    return false;
  }
  return arg instanceof ProgramMetadata;
}

export function isStateMeta(arg: unknown): arg is StateMetadata {
  if (typeof arg !== 'object') {
    return false;
  }
  return arg instanceof StateMetadata;
}
