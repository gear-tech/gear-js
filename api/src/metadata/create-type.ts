import { Codec, Registry } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { TypeRegistry } from '@polkadot/types';

import { isJSON, toJSON } from '../utils/json';
import { GearMetadata } from './metadata';
import { gearTypes } from '../default';

export class CreateType {
  public registry: Registry;
  private metadata: GearMetadata;

  constructor(hexRegistry?: HexString) {
    if (!hexRegistry) {
      this.registry = new TypeRegistry();
      this.registerDefaultTypes();
    } else {
      this.metadata = new GearMetadata(hexRegistry);
    }
  }

  private registerDefaultTypes() {
    this.registry.setKnownTypes({ types: gearTypes });
    this.registry.register(gearTypes);
  }

  /**
   *
   * @param type `TypeName` to encode or decode payload
   * @param payload `Payload` that have to be encoded or decoded
   * @returns Codec
   * @example
   * ```javascript
   * const createType = new CreateType();
   * const encoded = createType.create('String', 'Hello, World');
   * console.log(encoded.toHex()); // 0x48656c6c6f2c20576f726c6421
   *
   * const decoded = createType.create('String', '0x48656c6c6f2c20576f726c6421');
   * console.log(decoded.toHuman()); // "Hello, World!"
   */

  public create<T extends Codec = Codec>(typeOrTypeIndex: string | number, payload: unknown): T {
    let [type, index] =
      typeof typeOrTypeIndex === 'string' ? [typeOrTypeIndex, undefined] : [undefined, typeOrTypeIndex];

    if (payload === undefined) {
      payload = '0x';
    } else if (isJSON(payload)) {
      payload = toJSON(payload);
    }

    if (type === undefined) {
      type = 'Bytes';
    }

    if (this.metadata) {
      index = index || this.metadata.getTypeIndexByName(type);
      return this.metadata.createType(index, payload) as T;
    }
    return this.registry.createType(type, payload);
  }
  /**
   *
   * @param type `TypeName` to encode or decode payload
   * @param payload `Payload` that have to be encoded or decoded
   * @param hexRegistry registry in hex format
   * @param defaultTypes set to true if you want to register default types too
   * @returns Codec
   * @example
   * ```javascript
   * const encoded = CreateType.create('String', 'Hello, World');
   * console.log(encoded.toHex()); // 0x48656c6c6f2c20576f726c6421
   * ```
   */
  static create<T extends Codec = Codec>(type: string, payload: unknown, hexRegistry?: HexString): T {
    const createType = new CreateType(hexRegistry);
    return createType.create(type, payload) as unknown as T;
  }
}
