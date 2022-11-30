import { RegistryTypes } from '@polkadot/types-codec/types';
import { Codec, Registry } from '@polkadot/types/types';
import { Bytes, TypeRegistry } from '@polkadot/types';
import { HexString } from '@polkadot/util/types';
import { isHex, isU8a } from '@polkadot/util';

import { toJSON, isJSON, getTypeAndPayload, typeIsGeneric, typeIsString } from '../utils';
import { TypeInfoRegistry } from './TypeInfoReg';
import { gearTypes } from '../default';

export class CreateType {
  registry: Registry;
  #typeInfoReg: TypeInfoRegistry;

  constructor(registryOrRegistryTypes?: TypeRegistry | Registry | HexString | Uint8Array, defaultTypes?: boolean) {
    if (!registryOrRegistryTypes) {
      this.registry = new TypeRegistry();
    } else if (isHex(registryOrRegistryTypes) || isU8a(registryOrRegistryTypes)) {
      this.#typeInfoReg = new TypeInfoRegistry(registryOrRegistryTypes);
      this.registry = this.#typeInfoReg.registry;
    } else if (registryOrRegistryTypes) {
      this.registry = registryOrRegistryTypes;
    }
    if (defaultTypes) {
      this.registerDefaultTypes();
    }
  }

  /**
   * Register your custom types after CreateType class intialization
   * @param types
   * @param defaultTypes set to true if you want to register default types too
   * @example
   * ```javascript
   * const types = {
   *    CustomStruct: {
   *      fieldA: 'String',
   *      fieldB: 'u8'
   *    },
   *    CustomEnum: {
   *      _enum: {
   *        optionA: 'Option<CustomStruct>',
   *        optionB: 'BTreeSet<i32>'
   *      }
   *    }
   * };
   * const createType = new CreateType();
   * createType.registerTypes(types);
   * createType.create('CustomStruct', { fieldA: 'Hello', fieldB: 255 });
   * ```
   */
  public registerTypes(types: RegistryTypes, defaultTypes?: boolean) {
    this.registry.setKnownTypes({ types });
    this.registry.register(types);
    if (defaultTypes) {
      this.registerDefaultTypes;
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

  public create(type: string, payload: unknown): Codec {
    [type, payload] = getTypeAndPayload(type, payload);
    if (this.#typeInfoReg) {
      type = typeIsGeneric(type) ? this.#typeInfoReg.getGenericName(type) : this.#typeInfoReg.getShortName(type);
    }
    return this.createType(type, isJSON(payload) ? toJSON(payload) : payload);
  }

  static create(type: string, payload: unknown, hexRegistry?: HexString): Codec;

  static create(type: string, payload: unknown, defaultTypes?: boolean): Codec;

  static create(
    type: string,
    payload: unknown,
    hexRegistryOrDefaultTypes?: HexString | boolean,
    defaultTypes?: boolean,
  ): Codec;

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
  static create(
    type: string,
    payload: unknown,
    hexRegistryOrDefaultTypes?: HexString | boolean,
    defaultTypes?: boolean,
  ): Codec {
    const [hexRegistry, _default] =
      typeof hexRegistryOrDefaultTypes === 'boolean'
        ? [undefined, hexRegistryOrDefaultTypes]
        : [hexRegistryOrDefaultTypes, defaultTypes];

    const createType = new CreateType(hexRegistry, _default);
    return createType.create(type, payload);
  }

  private createType(type: string, data: unknown): Codec {
    if (typeIsString(type)) {
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
