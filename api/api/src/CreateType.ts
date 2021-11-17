import { GearApi } from '.';
import { Metadata } from './interfaces';
import { CreateTypeError } from './errors';
import { isHex, hexToU8a, isU8a } from '@polkadot/util';
import { Registry, Codec } from '@polkadot/types/types';
import { Bytes, TypeRegistry } from '@polkadot/types';
import { PortableRegistry } from '@polkadot/types/metadata';
import { toCamelCase, splitByCommas, toJSON, isJSON } from './utils';
const REGULAR_EXP = {
  endWord: /\b\w+\b/g,
  angleBracket: /<.+>/,
  roundBracket: /^\(.+\)$/,
  squareBracket: /^\[.+\]$/,
};

const STD_TYPES = {
  Result: (ok, err) => {
    return {
      _enum_Result: {
        ok,
        err,
      },
    };
  },
  Option: (some) => {
    return {
      _enum_Option: some,
    };
  },
  Vec: (type) => {
    return [type];
  },
  VecDeque: (type) => {
    return [type];
  },
  BTreeMap: (key, value) => {
    return {
      [key]: value,
    };
  },
};

export class CreateType {
  registry: Registry;
  namespaces: Map<string, string>;

  constructor(gearApi?: GearApi) {
    this.registry = gearApi?.registry || new TypeRegistry();
    this.namespaces = undefined;
  }

  private createRegistry(types?: any): Map<string, string> {
    if (!types) {
      return null;
    }
    if (isHex(types) || isU8a(types)) {
      const { typesFromTypeDef, namespaces } = CreateType.getTypesFromTypeDef(
        isHex(types) ? hexToU8a(types) : types,
        this.registry,
      );
      types = typesFromTypeDef;
      this.namespaces = namespaces;
    }
    this.registerTypes(types);
    return this.namespaces;
  }

  static getTypesFromTypeDef(
    types: Uint8Array,
    registry?: Registry,
  ): { typesFromTypeDef: any; namespaces: Map<string, string> } {
    if (!registry) {
      registry = new TypeRegistry();
    }
    const typesFromTypeDef = {};
    const namespaces = new Map<string, string>();
    const portableReg = new PortableRegistry(registry, types);
    portableReg.types.forEach(({ id, type: { path } }) => {
      const typeDef = portableReg.getTypeDef(id);
      if (path.length === 0 || (!typeDef.lookupName && !typeDef.lookupNameRoot)) {
        return;
      }
      const name = portableReg.getName(id);
      namespaces.set(name.replace(toCamelCase(path.slice(0, path.length - 1)), ''), name);
      typesFromTypeDef[typeDef.lookupName || typeDef.lookupNameRoot] = typeDef.type.toString();
    });
    return { typesFromTypeDef, namespaces };
  }

  private registerTypes(types?: any) {
    this.registry.setKnownTypes({ types: { ...types } });
    this.registry.register({ ...types });
  }

  private checkTypePayload(type: any, payload: any) {
    if (!payload) {
      throw new CreateTypeError('Data is not specified');
    }
    if (!type) {
      return 'Bytes';
    }
    return type;
  }

  create(type: any, payload: any, meta?: Metadata): Codec {
    type = this.checkTypePayload(type, payload);
    const namespaces = meta?.types ? this.createRegistry(meta.types) : this.createRegistry();

    if (isJSON(type)) {
      const types = toJSON(`{"Custom": ${JSON.stringify(toJSON(type))}}`);
      this.registerTypes(types);
      return this.createType('Custom', toJSON(payload));
    } else {
      return this.createType(
        namespaces ? setNamespaces(type, namespaces) : type,
        isJSON(payload) ? toJSON(payload) : payload,
      );
    }
  }

  static encode(type: any, payload: any, meta?: Metadata): Codec {
    const createType = new CreateType();
    return createType.create(type, payload, meta);
  }

  static decode(type: string, payload: any, meta?: Metadata): Codec {
    const createType = new CreateType();
    return createType.create(type, payload, meta);
  }

  private createType(type: any, data: any): Codec {
    if (typeIsString(type, data)) {
      return this.registry.createType('String', data);
    } else if (type.toLowerCase() === 'bytes') {
      if (data instanceof Uint8Array) {
        return this.registry.createType('Bytes', Array.from(data));
      } else if (data instanceof Bytes) {
        return data;
      }
      return this.registry.createType('Bytes', data);
    } else {
      return this.registry.createType(type, data);
    }
  }
}

function typeIsString(type: any, data?: any): boolean {
  if (data) {
    return ['string', 'utf8', 'utf-8', 'text'].includes(type.toLowerCase()) && typeof data === 'string';
  } else {
    return ['string', 'utf8', 'utf-8', 'text'].includes(type.toLowerCase());
  }
}

export function parseHexTypes(hexTypes: string) {
  let { typesFromTypeDef, namespaces } = CreateType.getTypesFromTypeDef(hexToU8a(hexTypes));
  const result = {};
  namespaces.forEach((value, key) => {
    result[key] = JSON.parse(replaceNamespaces(typesFromTypeDef[value], namespaces));
  });
  return result;
}

function setNamespaces(type: string, namespaces: Map<string, string>): string {
  type.match(REGULAR_EXP.endWord).forEach((match) => {
    type = namespaces && namespaces.has(match) ? type.replace(match, namespaces.get(match)) : type;
  });
  return type;
}

function replaceNamespaces(type: string, namespaces: Map<string, string>): string {
  const match = type.match(REGULAR_EXP.endWord);
  namespaces.forEach((value, key) => {
    type = match.includes(value) ? type.replace(value, key) : type;
  });
  return type;
}

export function getTypeStructure(typeName: string, types: any) {
  if (!typeName) {
    return undefined;
  }
  // check tuples
  let match = typeName.match(REGULAR_EXP.roundBracket);
  if (match) {
    const entryType = match[0].slice(1, match[0].length - 1);
    const splitted = splitByCommas(entryType);
    return splitted.map((value) => getTypeStructure(value, types));
  }

  // check arrays
  match = typeName.match(REGULAR_EXP.squareBracket);
  if (match) {
    const splitted = typeName.slice(1, typeName.length - 1).split(';');
    return new Array(+splitted[1]).fill(getTypeStructure(splitted[0], types));
  }

  // check generic
  match = typeName.match(REGULAR_EXP.angleBracket);
  if (match) {
    const stdType = typeName.slice(0, match.index);
    if (stdType in STD_TYPES) {
      const entryType = match[0].slice(1, match[0].length - 1);
      const splitted = splitByCommas(entryType);
      return STD_TYPES[stdType](getTypeStructure(splitted[0], types), getTypeStructure(splitted[1], types));
    } else {
      return getTypeStructure(stdType, types);
    }
  }

  const type = toJSON(JSON.stringify(types[typeName]));

  // check custom types
  if (!type) {
    return typeName;
  }

  const result = {};
  Object.keys(type).forEach((key: string) => {
    if (key === '_enum') {
      result['_enum'] = type[key];
      Object.keys(result['_enum']).forEach((subKey: string) => {
        result['_enum'][subKey] = getTypeStructure(result['_enum'][subKey], types);
      });
    } else {
      result[key] =
        type[key] in types || type[key].match(REGULAR_EXP.angleBracket)
          ? getTypeStructure(type[key], types)
          : type[key];
    }
  });
  return result;
}
