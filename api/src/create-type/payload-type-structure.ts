import { enumTypes, TypeTree } from './interfaces';
import { isJSON, splitByCommas, toJSON } from '../utils';
import generate from './generate';
import { REGULAR_EXP } from './regexp';

function getIfTuple(typeName: string, types: any, raw: boolean): TypeTree | TypeTree[] | null {
  const match = typeName.match(REGULAR_EXP.roundBracket);
  if (match) {
    const entryType = match[0].slice(1, match[0].length - 1);
    const splitted = splitByCommas(entryType);
    const value = splitted.map((value) => createPayloadTypeStructure(value, types, raw));
    return raw ? value : generate.Tuple(typeName, value);
  }
  return null;
}

function getIfArray(typeName: string, types: any, raw: boolean): TypeTree | [TypeTree, number] | null {
  const match = typeName.match(REGULAR_EXP.squareBracket);
  if (match) {
    const splitted = typeName.slice(1, typeName.length - 1).split(';');
    const value: [TypeTree, number] = [createPayloadTypeStructure(splitted[0], types, raw), parseInt(splitted[1])];
    return raw ? value : generate.Array(typeName, ...value);
  }
  return null;
}

function getIfGeneric(typeName: string, types: any, raw: boolean): TypeTree | null {
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
      return raw ? { [`_${type}`]: value } : generate[type](typeName, ...value);
    } else {
      return createPayloadTypeStructure(type, types, raw);
    }
  }
  return null;
}

function getIfStruct(typeName: string, types: any, raw: boolean): TypeTree | null {
  const value: any = {};
  if (types[typeName] && typeof types[typeName] === 'object') {
    Object.keys(types[typeName]).forEach((field) => {
      value[field] = createPayloadTypeStructure(types[typeName][field], types, raw);
    });
  } else if (isJSON(typeName)) {
    const jsonTypeName = toJSON(typeName);
    Object.keys(jsonTypeName).forEach((field) => {
      value[field] = createPayloadTypeStructure(jsonTypeName[field], types, raw);
    });
  } else {
    return null;
  }
  return raw ? value : generate.Struct(typeName, value);
}

function getIfEnum(typeName: string, types: any, raw: boolean): TypeTree | { _enum: any } | null {
  if (types[typeName] && typeof types[typeName] === 'object') {
    if (Object.keys(types[typeName]).length === 1 && Object.keys(types[typeName]).includes('_enum')) {
      const type = types[typeName];
      const value: any = {};
      Object.keys(type['_enum']).forEach((field) => {
        value[field] = createPayloadTypeStructure(type['_enum'][field], types, raw);
      });
      return raw ? { _enum: value } : generate.Enum(typeName, value);
    }
  }
  return null;
}

/**
 *
 * @param typeName to create its structure
 * @param types
 * @returns
 */
export function createPayloadTypeStructure(typeName: string, types: any, raw = false): TypeTree | any {
  if (!typeName) {
    return undefined;
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

  return raw ? typeName : generate.Primitive(typeName);
}
