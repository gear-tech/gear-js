import { ProgramMetadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import isPlainObject from 'lodash.isplainobject';

import { isNullOrUndefined } from '@/shared/helpers';

import { MetadataTypes, MedatadaTypesValue } from '../model';

const isEmptyObject = (value: unknown) => isPlainObject(value) && !Object.keys(value as object).length;

// TODO: types
const getNamedTypes = (metadata: ProgramMetadata, onError: (message: string) => void) => {
  const getName = (type: number) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- TODO(#1800): resolve eslint comments
      return metadata.getTypeName(type);
    } catch (error) {
      onError(error instanceof Error ? error.message : `Something went wrong on metadata.getTypeName(${type})`);
      return `Invalid metadata`;
    }
  };

  const getTypes = (type: MetadataTypes | MedatadaTypesValue) => {
    if (isNullOrUndefined(type)) return type;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- TODO(#1800): resolve eslint comments
    if (typeof type === 'number') return getName(type);

    const entries = Object.entries(type)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- TODO(#1800): resolve eslint comments
      .map(([key, value]) => [key, getTypes(value)])
      .filter(([, value]) => !isNullOrUndefined(value) && !isEmptyObject(value)) as [string, AnyJson][];

    return Object.fromEntries(entries);
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- TODO(#1800): resolve eslint comments
  return getTypes(metadata.types);
};

// TODO(#1737): change any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFlatNamedTypeEntries = (types: object, parentKey = ''): any =>
  Object.entries(types).flatMap(([key, value]) => {
    const nestedKey = parentKey ? `${parentKey}.${key}` : key;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- TODO(#1800): resolve eslint comments
    return isPlainObject(value) ? getFlatNamedTypeEntries(value as object, nestedKey) : [[nestedKey, value]];
  });

export { getNamedTypes, getFlatNamedTypeEntries };
