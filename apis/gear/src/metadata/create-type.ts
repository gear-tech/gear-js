import { Codec, Registry } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { TypeRegistry } from '@polkadot/types';

import { isJSON, toJSON } from '../utils/json';
import { GearMetadata } from './metadata';
import { gearTypes } from '../default';

export class CreateType {
  public registry: Registry;
  private metadata: GearMetadata;

  /**
   * Creates a new instance of CreateType for encoding and decoding payloads
   * @constructor
   * @description
   * Can be initialized in 3 ways:
   * 1. Without arguments - uses default type registry
   * 2. With custom types - registers provided types in addition to defaults
   * 3. With hex metadata - initializes from on-chain metadata
   * 
   * @example
   * ```typescript
   * // Default initialization
   * const createType = new CreateType();
   * 
   * // With custom types
   * const createType = new CreateType({
   *   MyStruct: {
   *     field1: 'u8',
   *     field2: 'String'
   *   }
   * });
   * 
   * // With hex metadata
   * const createType = new CreateType('0x...');
   * ```
   */
  constructor();
  constructor(types: Record<string, Record<string, any> | string>)
  constructor(hexRegistry: HexString);
  constructor(typesOrHexRegistry?: Record<string, Record<string, any> | string> | HexString) {
    if (!typesOrHexRegistry) {
      this.registry = new TypeRegistry();
      this.registerDefaultTypes();
    } else if (typeof typesOrHexRegistry === 'string') {
      this.metadata = new GearMetadata(typesOrHexRegistry);
    } else {
      this.registry = new TypeRegistry();
      this.registerDefaultTypes();
      this.registerCustomTypes(typesOrHexRegistry);
    }
  }

  private registerDefaultTypes() {
    this.registry.setKnownTypes({ types: gearTypes });
    this.registry.register(gearTypes);
  }

  /**
   * ## Register custom types
   * @param types
   * @example
   * ```javascript
   * const createType = new CreateType();
   * createType.registerCustomTypes({
   *   MyType: 'u32',
   *   MyStruct: {
   *     field1: 'u8',
   *     field2: 'u16',
   *   },
   * });
   * ```
   */
  public registerCustomTypes(types: Record<string, Record<string, any> | string>): void {
    this.registry.setKnownTypes({ types });
    this.registry.register(types);
  }

  /**
   * Create a type instance for encoding or decoding payloads
   * 
   * @param type The type name or type index to encode/decode the payload. Can be:
   * - A built-in type like 'String', 'u32', etc.
   * - A custom type that was registered via registerCustomTypes()
   * - A type index from metadata
   * @param payload The data to encode or decode:
   * - For encoding: Pass the raw value
   * - For decoding: Pass the hex string or Uint8Array
   * @returns A Codec instance that provides methods like:
   * - toHex(): Get hex representation
   * - toHuman(): Get human readable format
   * - toJSON(): Get JSON format
   * - toU8a(): Get Uint8Array bytes
   * 
   * @example
   * ```typescript
   * // Encoding a string
   * const createType = new CreateType();
   * const encoded = createType.create('String', 'Hello, World');
   * console.log(encoded.toHex()); // 0x48656c6c6f2c20576f726c6421
   * 
   * // Decoding hex data
   * const decoded = createType.create('String', '0x48656c6c6f2c20576f726c6421');
   * console.log(decoded.toHuman()); // "Hello, World!"
   * 
   * // Using custom types
   * createType.registerCustomTypes({
   *   User: {
   *     name: 'String',
   *     age: 'u8'
   *   }
   * });
   * const user = createType.create('User', { name: 'Alice', age: 25 });
   * ```
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
   * Static method to create a Codec instance for encoding/decoding data.
   * 
   * @param type The type name to encode/decode the payload (e.g. 'String', 'u32', custom type)
   * @param payload The data to encode or hex string to decode
   * @param hexRegistry Optional hex-encoded type registry for custom types
   * @returns A Codec instance with methods like toHex(), toHuman(), toJSON(), toU8a()
   * 
   * @example
   * ```typescript
   * // Encode a string
   * const encoded = CreateType.create('String', 'Hello, World');
   * console.log(encoded.toHex()); // 0x48656c6c6f2c20576f726c6421
   * 
   * // Decode hex data
   * const decoded = CreateType.create('String', '0x48656c6c6f2c20576f726c6421'); 
   * console.log(decoded.toJSON()); // "Hello, World"
   * 
   * // Using custom types with registry
   * const registry = '0x...'; // Hex registry containing custom type definitions
   * const result = CreateType.create('MyCustomType', data, registry);
   * ```
   */
  static create<T extends Codec = Codec>(type: string, payload: unknown, hexRegistry?: HexString): T {
    const createType = new CreateType(hexRegistry);
    return createType.create(type, payload) as unknown as T;
  }
}
