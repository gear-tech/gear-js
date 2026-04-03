import type { ProgramMetadata } from '@gear-js/api';
import type { AnyJson } from '@polkadot/types/types';
import isPlainObject from 'lodash.isplainobject';

import { isNullOrUndefined } from '@/shared/helpers';

import type { MedatadaTypesValue, MetadataTypes } from '../model';

const isEmptyObject = (value: unknown) => isPlainObject(value) && !Object.keys(value as object).length;

// TODO: types
const getNamedTypes = (metadata: ProgramMetadata, onError: (message: string) => void) => {
  const getName = (type: number) => {
    try {
      return metadata.getTypeName(type);
    } catch (error) {
      onError(error instanceof Error ? error.message : `Something went wrong on metadata.getTypeName(${type})`);
      return 'Invalid metadata';
    }
  };

  const getTypes = (type: MetadataTypes | MedatadaTypesValue) => {
    if (isNullOrUndefined(type)) return type;

    if (typeof type === 'number') return getName(type);

    const entries = Object.entries(type)
      .map(([key, value]) => [key, getTypes(value)])
      .filter(([, value]) => !isNullOrUndefined(value) && !isEmptyObject(value)) as [string, AnyJson][];

    return Object.fromEntries(entries);
  };

  return getTypes(metadata.types);
};

// TODO(#1737): change any
const getFlatNamedTypeEntries = (types: object, parentKey = ''): any =>
  Object.entries(types).flatMap(([key, value]) => {
    const nestedKey = parentKey ? `${parentKey}.${key}` : key;

    return isPlainObject(value) ? getFlatNamedTypeEntries(value as object, nestedKey) : [[nestedKey, value]];
  });

export { getFlatNamedTypeEntries, getNamedTypes };
