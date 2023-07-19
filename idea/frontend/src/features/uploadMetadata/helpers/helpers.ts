import { ProgramMetadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import isPlainObject from 'lodash.isplainobject';

import { isNullOrUndefined } from 'shared/helpers';
import { MetadataTypes, MedatadaTypesValue } from '../model';

const isEmptyObject = (value: unknown) => isPlainObject(value) && !Object.keys(value as {}).length;

// TODO: types
const getNamedTypes = (metadata: ProgramMetadata) => {
  const getTypes = (type: MetadataTypes | MedatadaTypesValue) => {
    if (isNullOrUndefined(type)) return type;
    if (typeof type === 'number') return metadata.getTypeName(type);

    const entries = Object.entries(type)
      .map(([key, value]) => [key, getTypes(value)])
      .filter(([, value]) => !isNullOrUndefined(value) && !isEmptyObject(value)) as [string, AnyJson][];

    return Object.fromEntries(entries);
  };

  return getTypes(metadata.types);
};

const getFlatNamedTypeEntries = (types: {}, parentKey = ''): any =>
  Object.entries(types).flatMap(([key, value]): any => {
    const nestedKey = parentKey ? `${parentKey}.${key}` : key;

    return isPlainObject(value) ? getFlatNamedTypeEntries(value as {}, nestedKey) : [[nestedKey, value]];
  });

export { getNamedTypes, getFlatNamedTypeEntries };
