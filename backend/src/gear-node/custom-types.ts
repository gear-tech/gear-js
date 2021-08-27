import { stringToU8a } from '@polkadot/util';
import { TypeRegistry } from '@polkadot/types';
import { createTypeUnsafe } from '@polkadot/types';
import { Injectable } from '@nestjs/common';
import { Bytes } from '@polkadot/types';

@Injectable()
export class CreateType {
  registry: TypeRegistry;

  constructor() {
    this.registry = new TypeRegistry();
  }

  toBytes(type, data): Bytes {
    if (!type || !data) {
      return data;
    }

    if (isJSON(type)) {
      type = toJSON(`{"Custom": ${type}}`);
      this.registry.setKnownTypes({ types: { ...type } });
      this.registry.register({ ...type });
      return this.registry.createType(
        'Bytes',
        Array.from(
          createTypeUnsafe(this.registry, 'Custom', toJSON(data)).toU8a(),
        ),
      );
    } else {
      if (['string', 'utf8', 'utf-8'].includes(type.toLowerCase())) {
        return this.registry.createType('Bytes', Array.from(stringToU8a(data)));
      } else if (type.toLowerCase() === 'bytes') {
        return this.registry.createType('Bytes', data);
      } else {
        return this.registry.createType(
          'Bytes',
          Array.from(this.registry.createType(type, data).toU8a()),
        );
      }
    }
  }

  fromBytes(type, data) {
    if (!type || !data) {
      return data;
    }
    if (isJSON(type)) {
      type = toJSON(`{"Custom": ${type}}`);
      this.registry.setKnownTypes({ types: { ...type } });
      this.registry.register({ ...type });
      return createTypeUnsafe(this.registry, 'Custom', data);
    } else {
      return this.registry.createType(type, data);
    }
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
