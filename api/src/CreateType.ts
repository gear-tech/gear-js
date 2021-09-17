import { GearApi } from '.';
import { CreateTypeError } from './errors';
import { stringToU8a } from '@polkadot/util';
import { Registry } from '@polkadot/types/types';
import { Bytes, TypeRegistry } from '@polkadot/types';
import { Metadata } from './interfaces/metadata';

export class CreateType {
  private defaultTypes: any;

  constructor(gearApi?: GearApi) {
    this.defaultTypes = gearApi ? gearApi.defaultTypes : undefined;
  }

  private getRegistry(types?: any) {
    const registry = new TypeRegistry();
    this.registerTypes(registry, types);
    return registry;
  }

  private registerTypes(registry: Registry, types?: any) {
    registry.setKnownTypes({ types: { ...types, ...this.defaultTypes } });
    registry.register({ ...types, ...this.defaultTypes });
  }

  private checkTypePayload(type: any, payload: any) {
    if (!type) {
      throw new CreateTypeError('Type is not specified');
    }
    if (!payload) {
      throw new CreateTypeError('Data is not specified');
    }
  }

  encode(type: any, payload: any, meta?: Metadata): Bytes {
    this.checkTypePayload(type, payload);

    if (payload instanceof Bytes) return payload;

    const registry = meta?.types ? this.getRegistry(meta.types) : this.getRegistry();

    if (isJSON(type)) {
      const types = toJSON(`{"Custom": ${JSON.stringify(toJSON(type))}}`);
      this.registerTypes(registry, types);
      return this.toBytes(registry, 'Custom', toJSON(payload));
    } else {
      return this.toBytes(registry, type, isJSON(payload) ? toJSON(payload) : payload);
    }
  }

  decode(type: string, payload: any, meta?: Metadata): any {
    this.checkTypePayload(type, payload);

    const registry = meta?.types ? this.getRegistry(meta.types) : this.getRegistry();

    if (isJSON(type)) {
      const types = toJSON(`{"Custom": ${JSON.stringify(toJSON(type))}}`);
      this.registerTypes(registry, types);
      return this.fromBytes(registry, 'Custom', toJSON(payload));
    } else {
      return this.fromBytes(registry, type, isJSON(payload) ? toJSON(payload) : payload);
    }
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
      return registry.createType('Bytes', Array.from(stringToU8a(data)));
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
      return registry.createType('Bytes', Array.from(stringToU8a(data)));
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
