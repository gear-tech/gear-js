import { isJSON, toJSON, TypeInfoRegistry } from '@gear-js/api';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { Output } from './output.js';
import { Types } from './types-replace.js';

const REGEXPs = {
  array: /\[.*;\d*\]/,
};

const GENERICS = {
  BTreeMap: 'BTreeMap<',
  Option: 'Option<',
  Vec: 'Vec<',
  BTreeSet: 'BTreeSet<',
  Result: 'Result<',
};

function getStringType(typeName: string, type: string, callback: (type) => void) {
  if (type === '[u8;32]') {
    return '`0x${string}`';
  }
  if (REGEXPs.array.test(type)) {
    if (type in Types) {
      return Types[type];
    } else {
      const [_type, length] = type.slice(1, -1).split(';');
      return `RustArray<${_type}, ${length}>`;
    }
  }
  if (type === 'Text') {
    return 'string';
  }
  if (type.startsWith(GENERICS.BTreeMap)) {
    const [key, value] = type.slice(GENERICS.BTreeMap.length, -1).split(', ');
    return `Map<${getInterface(typeName, key, callback)}, ${getInterface(typeName, value, callback)}>`;
  }
  if (type.startsWith(GENERICS.Option)) {
    const key = type.slice(GENERICS.Option.length, -1);
    return `${getInterface(typeName, key, callback)} | null`;
  }
  if (type.startsWith(GENERICS.Vec)) {
    const key = type.slice(GENERICS.Vec.length, -1);
    return `Array<${getInterface(typeName, key, callback)}>`;
  }
  if (type.startsWith(GENERICS.BTreeSet)) {
    const key = type.slice(GENERICS.BTreeSet.length, -1);
    return `Set<${getInterface(typeName, key, callback)}>`;
  }
  if (type.startsWith(GENERICS.Result)) {
    const [ok, err] = type.slice(GENERICS.Result.length, -1).split(', ');
    return `{ ok: ${getInterface(typeName, ok, callback)} } | { err: ${getInterface(typeName, err, callback)} } `;
  }
  if (type.startsWith('(')) {
    const elements = type.slice(1, -1).split(',');
    return `[${elements.map((element) => getInterface(typeName, element, callback)).join(', ')}]`;
  }
  callback(type);
  return type;
}

function getInterface(typeName: string, type: any, callback: (type) => void): any {
  let result;
  const typeOfType = typeof type;

  if (isJSON(type)) {
    type = toJSON(type);
    if ('_enum' in type) {
      if (Array.isArray(type['_enum'])) {
        result = type['_enum'].map((variant) => `'${variant}'`).join(' | ');
      } else {
        return { kind: 'enum', def: getEnumNamespace(typeName, type, callback) };
      }
    } else {
      const struct = {};
      for (const field of Object.keys(type)) {
        struct[field] = getInterface(typeName, type[field], callback);
      }
      return JSON.stringify(struct, undefined, 2).replaceAll('"', '');
    }
  } else if (typeOfType === 'string') {
    return getStringType(typeName, type, callback);
  }

  return result;
}

function getEnumNamespace(typeName: string, type: { _enum: any }, callback: (type) => void) {
  const namespaceTypes = {};
  const namespaceName = `${typeName}Enum`;
  const enumTypeDef = [];
  Object.keys(type._enum).forEach((key) => {
    namespaceTypes[`${key}Data`] = getInterface(typeName, type._enum[key], callback);
    namespaceTypes[key] = `${key}Data`;
    enumTypeDef.push(`${namespaceName}.${key}`);
  });
  return { namespaceName, enumTypeDef, namespaceTypes };
}

export function generateTypes(registry: TypeInfoRegistry, saveTo: string) {
  const out = new Output(join(saveTo, './types.ts'));
  const types = registry.getTypes();
  const primitiveTypes = new Set<string>();
  const allTypes = [];
  for (const type of Object.keys(types)) {
    if (type in Types) {
      primitiveTypes.add(`export type ${type} = ${Types[type]}`);
    } else {
      const typeDef = getInterface(type, types[type], (type) => {
        if (type in Types) {
          primitiveTypes.add(`export type ${type} = ${Types[type]}`);
        }
      });
      if (typeof typeDef === 'string') {
        out.line(`export type ${type} = ${typeDef}`);
        out.line();
      } else if (typeDef.kind === 'enum') {
        out.block(`export namespace ${typeDef.def.namespaceName}`, () => {
          for (const item of Object.keys(typeDef.def.namespaceTypes)) {
            out.line(`export type ${item} = ${typeDef.def.namespaceTypes[item]}`);
            out.line();
          }
        });
        out.line(`export type ${type} = `, false);
        out.increaseIndent();
        for (const variant of typeDef.def.enumTypeDef) {
          out.line(`| ${variant}`, false);
        }
        out.reduceIndent();
        out.line();
      }
      allTypes.push(typeDef);
    }
    writeFileSync('./types.json', JSON.stringify(allTypes, undefined, 2));
    out.line();
  }
  out.firstLine(Array.from(primitiveTypes));
  out.save();
}
