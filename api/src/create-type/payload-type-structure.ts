import { AnyJson } from '@polkadot/types/types';

import { isJSON, splitByCommas, toJSON } from '../utils';
import { enumTypes, TypeTree } from './interfaces';
import { REGULAR_EXP } from './regexp';
import generate from './generate';

function getIfTuple(typeName: string, types: AnyJson, raw: boolean): TypeTree | TypeTree[] | null {
  if (typeName.includes(':')) return null;
  const match = typeName.match(REGULAR_EXP.roundBracket);
  if (match) {
    const entryType = match[0].slice(1, match[0].length - 1);
    const splitted = splitByCommas(entryType);
    const value = splitted.map((value) => createPayloadTypeStructure(value, types, raw));
    return raw ? value : generate.Tuple(typeName, value);
  }
  return null;
}

function getIfArray(typeName: string, types: AnyJson, raw: boolean): TypeTree | [TypeTree, number] | null {
  const match = typeName.match(REGULAR_EXP.squareBracket);
  if (match) {
    const splitted = typeName.slice(1, typeName.length - 1).split(';');
    const value: [TypeTree, number] = [createPayloadTypeStructure(splitted[0], types, raw), parseInt(splitted[1])];
    return raw ? value : generate.Array(typeName, ...value);
  }
  return null;
}

function getIfGeneric(typeName: string, types: AnyJson, raw: boolean): TypeTree | any | null {
  if (typeName.includes(':')) return null;

  const match = typeName.match(REGULAR_EXP.angleBracket);
  if (match) {
    const type = typeName.slice(0, match.index);
    if (type in enumTypes) {
      const entryType = match[0].slice(1, match[0].length - 1);
      const splitted = splitByCommas(entryType);
      const value = [
        createPayloadTypeStructure(splitted[0], types, raw),
        createPayloadTypeStructure(splitted[1], types, raw),
      ];
      if (raw) {
        if (type === 'Result') {
          return {
            _Result: {
              ok: value[0],
              err: value[1],
            },
          };
        } else {
          return { [`_${type}`]: value[1] ? value : value[0] };
        }
      }
      return generate[type](typeName, ...value);
    } else {
      return createPayloadTypeStructure(type, types, raw);
    }
  }
  return null;
}

function getIfStruct(typeName: string, types: AnyJson, raw: boolean): TypeTree | null {
  const value: any = {};
  if (types[typeName] && isJSON(types[typeName])) {
    const jsoned = toJSON(types[typeName]);
    Object.keys(jsoned).forEach((field) => {
      value[field] = createPayloadTypeStructure(jsoned[field], types, raw);
    });
  } else if (isJSON(typeName)) {
    const jsonedTypeName = toJSON(typeName);
    Object.keys(jsonedTypeName).forEach((field) => {
      value[field] = createPayloadTypeStructure(jsonedTypeName[field], types, raw);
    });
  } else {
    return null;
  }
  return raw ? value : generate.Struct(typeName, value);
}

function getIfEnum(typeName: string, types: AnyJson, raw: boolean): TypeTree | { _enum: any } | null {
  if (types[typeName] && typeof types[typeName] === 'object') {
    if (Object.keys(types[typeName]).length === 1 && Object.keys(types[typeName]).includes('_enum')) {
      const type = types[typeName];
      const value: any = {};
      if (Array.isArray(type['_enum'])) {
        type['_enum'].forEach((field) => {
          value[field] = createPayloadTypeStructure('Null', types, raw);
        });
      } else {
        Object.keys(type['_enum']).forEach((field) => {
          value[field] = createPayloadTypeStructure(type['_enum'][field], types, raw);
        });
      }
      return raw ? { _enum: value } : generate.Enum(typeName, value);
    }
  }
  return null;
}

function getIfNull(typeName: string, raw: boolean) {
  if (typeName === 'Null') {
    return raw ? 'Null' : generate.Null();
  }
  return null;
}

/**
 *
 * @param typeName to create its structure
 * @param types
 * @param raw set it to true if there is a need to get type structure without additional fields
 * @returns
 */
export function createPayloadTypeStructure(typeName: string, types: AnyJson, raw = false): TypeTree | any {
  if (!typeName) {
    return undefined;
  }
  if (typeof typeName !== 'string') {
    typeName = JSON.stringify(typeName);
  }

  const regexp = new RegExp(`\\b${typeName}\\b`, 'gi');

  if (!types[typeName]) {
    const typeIgnoreCase = Object.keys(types).find((value) => regexp.test(value));
    if (typeIgnoreCase) {
      typeName = typeName.replace(regexp, typeIgnoreCase);
    }
  }

  const tuple = getIfTuple(typeName, types, raw);
  if (tuple) {
    return tuple;
  }
  const array = getIfArray(typeName, types, raw);
  if (array) {
    return array;
  }

  const generic = getIfGeneric(typeName, types, raw);
  if (generic) {
    return generic;
  }

  const _enum = getIfEnum(typeName, types, raw);
  if (_enum) {
    return _enum;
  }

  const struct = getIfStruct(typeName, types, raw);
  if (struct) {
    return struct;
  }
  const null_ = getIfNull(typeName, raw);
  if (null_) {
    return null_;
  }

  return raw ? typeName : generate.Primitive(typeName);
}
