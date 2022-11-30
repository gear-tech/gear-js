import { PortableRegistry, TypeRegistry } from '@polkadot/types';
import { HexString } from '@polkadot/util/types';
import { Codec, Registry } from '@polkadot/types/types';
import { hexToU8a } from '@polkadot/util';
import assert from 'assert';

import { HumanProgramMetadata, IProgramMetadata } from '../types';
import { CreateType } from '../create-type';
import { Si1LookupTypeId } from '@polkadot/types/interfaces';

export class ProgramApi {
  public metadata: HumanProgramMetadata;
  private registry: Registry;
  private portableRegistry: PortableRegistry;
  private types: Map<number, { name: string; def: any }>;

  constructor(hexMeta: HexString) {
    this.metadata = ProgramApi.decode(hexMeta);
    this.registry = new TypeRegistry();
    this.portableRegistry = new PortableRegistry(this.registry, hexToU8a(this.metadata.reg), true);
    this.types = new Map();
    this.prepare();
    this.registerTypes();
  }

  static decode(hexMeta: HexString): HumanProgramMetadata {
    const metadata = CreateType.create('ProgramMetadata', hexMeta, true) as IProgramMetadata;
    return metadata.toJSON() as unknown as HumanProgramMetadata;
  }

  private prepare() {
    for (const type of this.portableRegistry.types) {
      const name = this.portableRegistry.getName(type.id);
      const typeDef = this.portableRegistry.getTypeDef(type.id);
      if (name !== undefined) {
        this.types.set(type.id.toNumber(), { name: this.portableRegistry.getName(type.id), def: typeDef.type });
      } else {
        assert(
          typeDef.lookupIndex === type.id.toNumber(),
          'Lookup index of type is not equal to index in portable registry',
        );
        this.types.set(typeDef.lookupIndex, { name: typeDef.type, def: null });
      }
    }
  }

  private registerTypes() {
    const types = {};
    Array.from(this.types.values()).forEach(({ name, def }) => {
      if (def) {
        types[name] = def;
      }
    });
    this.registry.setKnownTypes({ types });
    this.registry.register(types);
  }

  createType(typeIndex: number, payload: unknown): Codec {
    const type = this.types.get(typeIndex);
    assert.notStrictEqual(type, undefined, `Type with index ${typeIndex} not found in registered types`);
    return this.registry.createType(type.name, payload);
  }

  getTypeDef(typeIndex: number) {
    assert.ok(this.types.has(typeIndex), `Type with index ${typeIndex} doesn't exist`);

    return getType(this.portableRegistry, typeIndex);
  }
}

interface TypeStructure {
  name: string;
  kind: 'primitive' | 'empty' | 'none' | 'sequence' | 'composite' | 'variant' | 'array' | 'tuple';
  type: string | object | TypeStructure;
  len?: number;
}

function getType(
  portableReg: PortableRegistry,
  typeIndex: number | Si1LookupTypeId,
  additionalFields = false,
): TypeStructure | any {
  const { def } = portableReg.getSiType(typeIndex);

  if (def.isPrimitive) {
    return additionalFields
      ? { name: def.asPrimitive.type, kind: 'primitive', type: def.asPrimitive.type }
      : def.asPrimitive.type;
  }

  if (def.isEmpty) {
    return additionalFields ? { name: '()', kind: 'empty', type: null } : null;
  }

  if (def.isNone) {
    return additionalFields ? { name: 'None', kind: 'none', type: null } : null;
  }

  if (def.isSequence) {
    console.log(def.toJSON());
    return additionalFields
      ? {
          name: 'Vec',
          kind: 'sequence',
          type: getType(portableReg, def.asSequence.type, additionalFields),
        }
      : [getType(portableReg, def.asSequence.type, additionalFields)];
  }

  if (def.isComposite) {
    let result = {};
    for (const { name, type, typeName } of def.asComposite.fields) {
      if (name.isSome) {
        result[name.unwrap().toString()] = getType(portableReg, type, additionalFields);
        continue;
      }
      if (def.asComposite.fields.length === 1) {
        result = getType(portableReg, type, additionalFields);
      }
    }
    return result;
  }

  if (def.isVariant) {
    const _variants = {};
    for (const { name, fields } of def.asVariant.variants) {
      if (fields.length === 0) {
        _variants[name.toString()] = null;
        continue;
      }

      if (fields.length === 1) {
        _variants[name.toString()] = getType(portableReg, fields[0].type, additionalFields);
        continue;
      }

      const fields_ = {};
      fields.map(({ name, type, typeName }) => {
        fields_[name.toString()] = type ? getType(portableReg, type, additionalFields) : null;
      });

      _variants[name.toString()] = fields_;
    }
    return { _variants };
  }

  if (def.isTuple) {
    return def.asTuple.map((index) => getType(portableReg, index, additionalFields));
  }

  if (def.isArray) {
    return [getType(portableReg, def.asArray.type, additionalFields), def.asArray.len.toNumber()];
  }
}
