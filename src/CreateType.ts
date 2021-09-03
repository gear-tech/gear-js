import { GearApi } from '@gear-js';
import { gearRpc } from '@gear-js/default';
import { CreateTypeError } from '@gear-js/errors';
import { stringToU8a } from '@polkadot/util';
import { Registry } from '@polkadot/types/types';
import { Bytes, TypeRegistry } from '@polkadot/types';
import { ApiPromise, WsProvider } from '@polkadot/api';

export class CreateType {
  private registry: TypeRegistry | Registry;
  private provider: WsProvider;
  private defaultTypes: any;
  private defaultRpc: any;

  constructor(gearApi: GearApi) {
    this.provider = gearApi.provider;
    this.defaultRpc = gearRpc;
    this.defaultTypes = gearApi.defaultTypes;
    this.createRegistry();
  }

  private createRegistry(types?: any): Promise<Registry> {
    return new Promise((resolve) => {
      ApiPromise.create({
        provider: this.provider,
        types: { ...this.defaultTypes, ...types },
        rpc: { ...this.defaultRpc }
      }).then((api) => {
        this.registry = api.registry;
        resolve(this.registry);
      });
    });
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
      await this.createRegistry(toJSON(`{"Custom": ${JSON.stringify(toJSON(type))}}`));
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
      await this.createRegistry(toJSON(`{"Custom": ${JSON.stringify(toJSON(type))}}`));
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
