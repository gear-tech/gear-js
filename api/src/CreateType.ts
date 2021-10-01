import { GearApi } from '.';
import { CreateTypeError } from './errors';
import { isHex, hexToU8a, isU8a } from '@polkadot/util';
import { Registry } from '@polkadot/types/types';
import { Bytes, TypeRegistry, GenericPortableRegistry } from '@polkadot/types';
import { Metadata } from './interfaces/metadata';

export class CreateType {
  private defaultTypes: any;

  constructor(gearApi?: GearApi) {
    this.defaultTypes = gearApi ? gearApi.defaultTypes : undefined;
  }

  private getRegistry(types?: any): { registry: TypeRegistry; namespaces?: Map<string, string> } {
    const registry = new TypeRegistry();
    if (!types) {
      return { registry };
    }

    let fromTypeDef: any;
    if (isHex(types)) {
      fromTypeDef = CreateType.getTypesFromTypeDef(hexToU8a(types), registry);
      types = fromTypeDef.types;
    } else if (isU8a(types)) {
      fromTypeDef = CreateType.getTypesFromTypeDef(types, registry).types;
      types = fromTypeDef.types;
    }
    this.registerTypes(registry, types);
    return { registry, namespaces: fromTypeDef?.namespaces };
  }

  static getTypesFromTypeDef(types: Uint8Array, registry?: Registry): { types: any; namespaces: Map<string, string> } {
    if (!registry) {
      registry = new TypeRegistry();
    }
    const result = {};
    const namespaces = new Map<string, string>();
    const genReg = new GenericPortableRegistry(registry, types);
    const compositeTypes = genReg.types.filter(({ type: { def } }) => def.isComposite || def.isVariant);
    compositeTypes.forEach(({ id, type: { path } }) => {
      const typeDef = genReg.getTypeDef(id);
      if (typeDef.lookupName) {
        let type = typeDef.type.toString();
        const name = path.pop().toHuman();
        namespaces.set(name, typeDef.lookupName);
        result[typeDef.lookupName] = type;
      }
    });
    return { types: result, namespaces };
  }

  private registerTypes(registry: Registry, types?: any) {
    registry.setKnownTypes({ types: { ...types, ...this.defaultTypes } });
    registry.register({ ...types, ...this.defaultTypes });
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

  encode(type: any, payload: any, meta?: Metadata): Bytes {
    type = this.checkTypePayload(type, payload);

    if (payload instanceof Bytes) return payload;

    const { registry, namespaces } = meta?.types ? this.getRegistry(meta.types) : this.getRegistry();
    if (isJSON(type)) {
      const types = toJSON(`{"Custom": ${JSON.stringify(toJSON(type))}}`);
      this.registerTypes(registry, types);
      return this.toBytes(registry, 'Custom', toJSON(payload));
    } else {
      return this.toBytes(
        registry,
        namespaces ? this.formType(type, namespaces) : type,
        isJSON(payload) ? toJSON(payload) : payload
      );
    }
  }

  decode(type: string, payload: any, meta?: Metadata): any {
    type = this.checkTypePayload(type, payload);

    const { registry, namespaces } = meta?.types ? this.getRegistry(meta.types) : this.getRegistry();

    if (isJSON(type)) {
      const types = toJSON(`{"Custom": ${JSON.stringify(toJSON(type))}}`);
      this.registerTypes(registry, types);
      return this.fromBytes(registry, 'Custom', toJSON(payload));
    } else {
      return this.fromBytes(
        registry,
        namespaces ? this.formType(type, namespaces) : type,
        isJSON(payload) ? toJSON(payload) : payload
      );
    }
  }

  private formType(type: string, namespaces: Map<string, string>): string {
    let reg = /\b\w+\b/g;
    let result: string;
    type.match(reg).forEach((match) => {
      result = namespaces && namespaces.has(match) ? type.replace(match, namespaces.get(match)) : type;
    });
    return result;
  }

  static encode(type: any, payload: any, meta?: Metadata): Bytes {
    const createType = new CreateType();
    return createType.encode(type, payload, meta);
  }

  static decode(type: string, payload: any, meta?: Metadata): any {
    const createType = new CreateType();
    return createType.decode(type, payload, meta);
  }

  private toBytes(registry: Registry, type: any, data: any): Bytes {
    if (typeIsString(type, data)) {
      return data;
      // return registry.createType('Bytes', Array.from(stringToU8a(data)));
    } else if (type.toLowerCase() === 'bytes') {
      if (data instanceof Uint8Array) {
        return registry.createType('Bytes', Array.from(data));
      }
      return registry.createType('Bytes', data);
    } else {
      return registry.createType('Bytes', Array.from(registry.createType(type, data).toU8a()));
    }
  }

  private fromBytes(registry: Registry, type: string, data: any) {
    if (typeIsString(type)) {
      return registry.createType('String', data);
    } else if (type.toLowerCase() === 'bytes') {
      return data;
    }
    return registry.createType(type, data);
  }
}

function isJSON(data: any) {
  try {
    JSON.parse(data);
  } catch (error) {
    try {
      if (JSON.stringify(data)[0] !== '{') {
        return false;
      }
    } catch (error) {
      return false;
    }
    return true;
  }
  return true;
}

function toJSON(data: any) {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
}

function typeIsString(type: any, data?: any): boolean {
  if (data) {
    return ['string', 'utf8', 'utf-8'].includes(type.toLowerCase()) && typeof data === 'string';
  } else {
    return ['string', 'utf8', 'utf-8'].includes(type.toLowerCase());
  }
}

export function parseHexTypes(hexTypes: string) {
  const { types, namespaces } = CreateType.getTypesFromTypeDef(hexToU8a(hexTypes));
  const result = {};
  namespaces.forEach((value, key) => {
    result[key] = types[value];
  });
  return result;
}
