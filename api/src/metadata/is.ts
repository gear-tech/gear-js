import { HumanProgramMetadata, HumanStateMetadata, OldMetadata } from '../types';

export function isOldMeta(arg: unknown): arg is OldMetadata {
  if (typeof arg === 'object') {
    if (Object.hasOwn(arg, 'types')) {
      return true;
    }
  }
  return false;
}

export function isProgramMeta(arg: unknown): arg is HumanProgramMetadata {
  if (typeof arg === 'object') {
    if (Object.hasOwn(arg, 'reg') && !Object.hasOwn(arg, 'functions')) {
      return true;
    }
  }
  return false;
}

export function isStateMeta(arg: unknown): arg is HumanStateMetadata {
  if (typeof arg === 'object') {
    if (Object.hasOwn(arg, 'reg') && Object.hasOwn(arg, 'functions')) {
      return true;
    }
  }
  return false;
}
