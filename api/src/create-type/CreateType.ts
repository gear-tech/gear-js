import { isHex, isU8a } from '@polkadot/util';
import { Registry, Codec } from '@polkadot/types/types';
import { Bytes, TypeRegistry } from '@polkadot/types';
import { RegistryTypes } from '@polkadot/types-codec/types/registry';

import { GearApi } from '../GearApi';
import { Metadata } from '../types/interfaces';
import { toJSON, isJSON } from '../utils/json';
import { Hex } from '../types';
import { checkTypeAndPayload, getTypesFromTypeDef, setNamespaces, typeIsString } from './utils';

export class CreateType {
  registry: Registry;
  namespaces: Map<string, string>;

  constructor(gearApi?: GearApi) {
    this.registry = gearApi?.registry || new TypeRegistry();
    this.namespaces = undefined;
  }

  private createRegistry(types?: Hex | object | Uint8Array): Map<string, string> {
    if (!types) {
      return null;
    }
    if (isHex(types) || isU8a(types)) {
      const { typesFromTypeDef, namespaces } = getTypesFromTypeDef(types, this.registry);
      types = typesFromTypeDef;
      this.namespaces = namespaces;
    }
    this.registerTypes(types as RegistryTypes);
    return this.namespaces;
  }

  /**
   * Register custom types in case of use custom types without
   * @param types
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
  public registerTypes(types?: RegistryTypes) {
    this.registry.setKnownTypes({ types: { ...types } });
    this.registry.register({ ...types });
  }

  /**
   *
   * @param type `TypeName` to encode or decode payload
   * @param payload `Payload` that have to be encoded or decoded
   * @param meta `Metadata` if type isn't standart rust Type
   * @returns Codec
   * @example
   * ```javascript
   * const createType = new CreateType();
   * const encoded = createType.create('String', 'Hello, World');
   * console.log(encoded.toHex()); // 0x48656c6c6f2c20576f726c6421
   *
   * const decoded = createType.create('String', '0x48656c6c6f2c20576f726c6421');
   * console.log(decoded.toHuman()); // "Hello, World!"
   *
   * // create type with metadata
   * const metadata = fs.readFileSync('path/to/file/with/metadata/*.meta.wasm);
   * const encoded = create(metadata.handle_input, somePayload, metadata);
   * console.log(encoded.toHex());
   * ```
   */
  public create(type: string, payload: unknown, meta?: Metadata): Codec {
    type = checkTypeAndPayload(type, payload);
    const namespaces = meta?.types ? this.createRegistry(meta.types) : this.createRegistry();

    return this.createType(
      namespaces ? setNamespaces(type, namespaces) : type,
      isJSON(payload) ? toJSON(payload) : payload,
    );
  }

  /**
   *
   * @param type `TypeName` to encode or decode payload
   * @param payload `Payload` that have to be encoded or decoded
   * @param meta `Metadata` if type isn't standart rust Type
   * @returns Codec
   * @example
   * ```javascript
   * const encoded = CreateType.create('String', 'Hello, World');
   * console.log(encoded.toHex()); // 0x48656c6c6f2c20576f726c6421
   * ```
   */
  static create(type: string, payload: unknown, meta?: Metadata): Codec {
    const createType = new CreateType();
    return createType.create(type, payload, meta);
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
