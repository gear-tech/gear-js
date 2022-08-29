import { Metadata } from '@gear-js/api';
import assert from 'assert';

export function assertMetaType(type: keyof Metadata, meta: Metadata): string {
  assert.notStrictEqual(meta[type], undefined, `${type} not found in metadata`);
  return meta[type] as string;
}
