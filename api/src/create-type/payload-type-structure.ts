import { enumTypes, TypeTree } from './interfaces';
import { splitByCommas } from '../utils';
import generate from './generate';
import { REGULAR_EXP } from './regexp';

function getIfTuple(typeName: string, types: any): TypeTree | null {
  const match = typeName.match(REGULAR_EXP.roundBracket);
  if (match) {
    const entryType = match[0].slice(1, match[0].length - 1);
    const splitted = splitByCommas(entryType);
    return generate.Tuple(
      typeName,
      splitted.map((value) => createPayloadTypeStructure(value, types)),
    );
  }
  return null;
}

function getIfArray(typeName: string, types: any): TypeTree | null {
  const match = typeName.match(REGULAR_EXP.squareBracket);
  if (match) {
    const splitted = typeName.slice(1, typeName.length - 1).split(';');
    return generate.Array(typeName, createPayloadTypeStructure(splitted[0], types), parseInt(splitted[1]));
  }
  return null;
}

function getIfGeneric(typeName: string, types: any): TypeTree | null {
  const match = typeName.match(REGULAR_EXP.angleBracket);
  if (match) {
    const type = typeName.slice(0, match.index);
    if (type in enumTypes) {
      const entryType = match[0].slice(1, match[0].length - 1);
      const splitted = splitByCommas(entryType);
      return generate[type](
        typeName,
        createPayloadTypeStructure(splitted[0], types),
        createPayloadTypeStructure(splitted[1], types),
      );
    } else {
      return createPayloadTypeStructure(type, types);
    }
  }
  return null;
}

function getIfStruct(typeName: string, types: any): TypeTree | null {
  if (types[typeName] && typeof types[typeName] === 'object') {
    const value: any = {};
    Object.keys(types[typeName]).forEach((field) => {
      value[field] = createPayloadTypeStructure(types[typeName][field], types);
    });
    return generate.Struct(typeName, value);
  }
  return null;
}

function getIfEnum(typeName: string, types: any): TypeTree | null {
  if (types[typeName] && typeof types[typeName] === 'object') {
    if (Object.keys(types[typeName]).length === 1 && Object.keys(types[typeName]).includes('_enum')) {
      const type = types[typeName];
      const value: any = {};
      Object.keys(type['_enum']).forEach((field) => {
        value[field] = createPayloadTypeStructure(type['_enum'][field], types);
      });
      return generate.Enum(typeName, value);
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
export function createPayloadTypeStructure(typeName: string, types: any): TypeTree {
  if (!typeName) {
    return undefined;
  }
  const tuple = getIfTuple(typeName, types);
  if (tuple) {
    return tuple;
  }

  const array = getIfArray(typeName, types);
  if (array) {
    return array;
  }

  const generic = getIfGeneric(typeName, types);
  if (generic) {
    return generic;
  }

  const _enum = getIfEnum(typeName, types);
  if (_enum) {
    return _enum;
  }

  const struct = getIfStruct(typeName, types);
  if (struct) {
    return struct;
  }

  return generate.Primitive(typeName);
}
