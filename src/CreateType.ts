import { GearApi } from '@gear-js';
import { CreateTypeError } from '@gear-js/errors';
import { stringToU8a } from '@polkadot/util';
import { Registry } from '@polkadot/types/types';
import { Bytes, TypeRegistry } from '@polkadot/types';

export class CreateType {
  private registry: TypeRegistry | Registry;

  constructor(gearApi: GearApi) {
    this.registry = gearApi.api.registry;
  }

  async encode(type: any, payload: any): Promise<Bytes | string | Uint8Array> {
    if (!type) {
      throw new CreateTypeError('Type is not specified');
    }
    if (!payload) {
      throw new CreateTypeError('Data is not specified');
    }

    if (payload instanceof Bytes || payload instanceof Uint8Array) return payload;

    if (isJSON(type)) {
      const types = toJSON(`{"Custom": ${JSON.stringify(toJSON(type))}}`);
      this.registry.setKnownTypes({ types: { ...types } });
      this.registry.register({...types})
      return this.toBytes('Custom', toJSON(payload));
    } else {
      return this.toBytes(type, isJSON(payload) ? toJSON(payload) : payload);
    }
  }

  async decode(type: string, payload: any): Promise<any> {
    if (!type) {
      throw new CreateTypeError('Type is not specified');
    }
    if (!payload) {
      throw new CreateTypeError('Data is not specified');
    }

    if (isJSON(type)) {
      const types = toJSON(`{"Custom": ${JSON.stringify(toJSON(type))}}`);
      this.registry.setKnownTypes({ types: { ...types } });
      this.registry.register({...types})
      return this.fromBytes('Custom', toJSON(payload));
    } else {
      return this.fromBytes(type, isJSON(payload) ? toJSON(payload) : payload);
    }
  }

  toBytes(type: any, data: any): Bytes {
    if (['string', 'utf8', 'utf-8'].includes(type.toLowerCase()) && typeof data === 'string') {
      return this.registry.createType('Bytes', Array.from(stringToU8a(data)));
    } else if (type.toLowerCase() === 'bytes') {
      return this.registry.createType('Bytes', data);
    } else {
      return this.registry.createType('Bytes', Array.from(this.registry.createType(type, data).toU8a()));
    }
  }

  private fromBytes(type: string, data: any) {
    if (['string', 'utf8', 'utf-8'].includes(type.toLowerCase())) {
      return this.registry.createType('Bytes', Array.from(stringToU8a(data)));
    } else if (type.toLowerCase() === 'bytes') {
      return data;
    }
    return this.registry.createType(type, data);
  }
}

export function isJSON(data: any) {
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
