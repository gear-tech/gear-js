import { Registry } from '@polkadot/types/types';
import { PortableRegistry } from '@polkadot/types/metadata';
import { isHex, hexToU8a } from '@polkadot/util';
import { TypeRegistry } from '@polkadot/types';
import { toCamelCase } from '../utils/string';
import { CreateTypeError } from '../errors';
import { REGULAR_EXP } from './regexp';
import { Hex } from '../types';

export function typeIsString(type: string): boolean {
  return ['string', 'utf8', 'utf-8', 'text'].includes(type.toLowerCase());
}

export function checkTypeAndPayload(type: string, payload: any): string {
  if (payload === undefined) {
    throw new CreateTypeError('Payload is not specified');
  }
  return type || 'Bytes';
}

function findTypeInNamepaces(type: string, namespaces: Map<string, string>) {
  for (let [key, value] of namespaces) {
    if (key.toLowerCase() === type.toLowerCase()) {
      return value;
    }
  }
  return undefined;
}

export function setNamespaces(type: string, namespaces: Map<string, string>): string {
  const matches = type.match(REGULAR_EXP.endWord);
  findTypeInNamepaces(type, namespaces);
  matches.forEach((match, index) => {
    if (namespaces) {
      let foundType =
        findTypeInNamepaces(match, namespaces) || findTypeInNamepaces(`${match}${matches[index + 1]}`, namespaces);
      if (foundType !== undefined) {
        type = type.replace(new RegExp(match, 'g'), foundType);
      }
    }
  });
  return type;
}

export function replaceNamespaces(type: string, namespaces: Map<string, string>): string {
  const match = type.match(REGULAR_EXP.endWord);
  namespaces.forEach((value, key) => {
    type = match.includes(value) ? type.replace(new RegExp(value, 'g'), key) : type;
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
  const portableReg = new PortableRegistry(registry, isHex(types) ? hexToU8a(types) : types, true);
  portableReg.types.forEach(({ id, type: { path } }) => {
    const typeDef = portableReg.getTypeDef(id);
    if (path.length === 0 || (!typeDef.lookupName && !typeDef.lookupNameRoot)) {
      return;
    }
    const name = portableReg.getName(id);
    let camelCasedNamespace = toCamelCase(path.slice(0, path.length - 1));
    if (camelCasedNamespace === name) {
      camelCasedNamespace = path.length > 2 ? toCamelCase(path.slice(0, path.length - 2)) : undefined;
    }
    namespaces.set(name.replace(camelCasedNamespace, ''), name);
    typesFromTypeDef[typeDef.lookupName || typeDef.lookupNameRoot] = typeDef.type.toString();
  });
  return { typesFromTypeDef, namespaces };
}
