import { Registry } from '@polkadot/types/types';
import { PortableRegistry } from '@polkadot/types/metadata';
import { isHex, hexToU8a, isU8a } from '@polkadot/util';
import { TypeRegistry } from '@polkadot/types';
import { toCamelCase } from '../utils/string';
import { CreateTypeError } from '../errors';
import { REGULAR_EXP } from './regexp';
import { Hex } from '../interfaces';

export function typeIsString(type: string): boolean {
  return ['string', 'utf8', 'utf-8', 'text'].includes(type.toLowerCase());
}

export function checkTypeAndPayload(type: string, payload: any): string {
  if (payload === undefined) {
    throw new CreateTypeError('Payload is not specified');
  }
  if (!type) {
    return 'Bytes';
  }
  return type;
}

export function setNamespaces(type: string, namespaces: Map<string, string>): string {
  const matches = type.match(REGULAR_EXP.endWord);
  matches.forEach((match, index) => {
    if (namespaces) {
      if (namespaces.has(match)) {
        type = type.replace(match, namespaces.get(match));
      } else if (index < matches.length - 1 && namespaces.has(`${match}${matches[index + 1]}`)) {
        type = type.replace(match, namespaces.get(`${match}${matches[index + 1]}`));
      }
    }
  });
  return type;
}

export function replaceNamespaces(type: string, namespaces: Map<string, string>): string {
  const match = type.match(REGULAR_EXP.endWord);
  namespaces.forEach((value, key) => {
    type = match.includes(value) ? type.replace(value, key) : type;
  });
  return type;
}

export function getTypesFromTypeDef(
  types: Uint8Array | Hex,
  registry?: Registry,
): { typesFromTypeDef: any; namespaces: Map<string, string> } {
  if (!registry) {
    registry = new TypeRegistry();
  }
  const typesFromTypeDef = {};
  const namespaces = new Map<string, string>();
  const portableReg = new PortableRegistry(registry, isHex(types) ? hexToU8a(types) : types);
  portableReg.types.forEach(({ id, type: { path } }) => {
    const typeDef = portableReg.getTypeDef(id);
    if (path.length === 0 || (!typeDef.lookupName && !typeDef.lookupNameRoot)) {
      return;
    }
    const name = portableReg.getName(id);
    let camelCasedNamespace = toCamelCase(path.slice(0, path.length - 1));
    if (camelCasedNamespace === name) {
      camelCasedNamespace = toCamelCase(path.slice(0, path.length - 2));
    }
    namespaces.set(name.replace(camelCasedNamespace, ''), name);
    typesFromTypeDef[typeDef.lookupName || typeDef.lookupNameRoot] = typeDef.type.toString();
  });
  return { typesFromTypeDef, namespaces };
}
