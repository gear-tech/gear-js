import { Codec, Registry } from '@polkadot/types/types';
import { PortableRegistry, TypeRegistry } from '@polkadot/types';
import { Si1LookupTypeId, Si1TypeDef } from '@polkadot/types/interfaces';
import { HexString } from '@polkadot/util/types';
import assert from 'assert';
import { hexToU8a } from '@polkadot/util';

import { TypeStructure } from '../types';

const LOOKUP_REGEXP = /\bLookup\d+\b/g;
const DIGITS_REGEXP = /\d+/;
const OPTION_REGEXP = /^Option<[\w\][;\d<>, ]+>$/;

function isOption(typeName: string, typeDef: Si1TypeDef): boolean {
  if (!typeDef.isVariant) {
    return false;
  }
  if (!OPTION_REGEXP.test(typeName)) {
    return false;
  }
  if (
    typeDef.asVariant.variants.length !== 2 ||
    typeDef.asVariant.variants.filter((v) => v.name.eq('Some') || v.name.eq('None')).length !== 2
  ) {
    return false;
  }
  return true;
}

export class GearMetadata {
  private registry: Registry;
  private regTypes: Map<number, { name: string; def: string }>;
  portableRegistry: PortableRegistry;

  constructor(hexRegistry: HexString) {
    this.registry = new TypeRegistry();
    this.portableRegistry = new PortableRegistry(this.registry, hexToU8a(hexRegistry), true);
    this.regTypes = new Map();
    this.prepare();
    this.registerTypes();
  }

  private prepare() {
    const updateTypes = [];
    for (const type of this.portableRegistry.types) {
      const name = this.portableRegistry.getName(type.id);
      const typeDef = this.portableRegistry.getTypeDef(type.id);
      if (name !== undefined) {
        this.regTypes.set(type.id.toNumber(), { name: this.portableRegistry.getName(type.id), def: typeDef.type });
      } else {
        assert(
          typeDef.lookupIndex === type.id.toNumber(),
          'Lookup index of type is not equal to index in portable registry',
        );
        if (typeDef.type.includes('Lookup')) {
          updateTypes.push(typeDef.lookupIndex);
        }
        this.regTypes.set(typeDef.lookupIndex, { name: typeDef.type, def: null });
      }
    }
    if (updateTypes.length > 0) {
      for (const id of updateTypes) {
        this.regTypes.get(id).name = this.getTypeName(id);
        for (const [type, { name, def }] of this.regTypes.entries()) {
          if (LOOKUP_REGEXP.test(def)) {
            const match = def.match(LOOKUP_REGEXP);
            let newDef = def;
            for (const m of match) {
              const index = Number(m.match(DIGITS_REGEXP)[0]);
              newDef = def.replace(m, this.getTypeName(index));
            }
            this.regTypes.set(type, { name, def: newDef });
          }
        }
      }
    }
  }

  private registerTypes() {
    const types = {};
    Array.from(this.regTypes.values()).forEach(({ name, def }) => {
      if (def) {
        types[name] = def;
      }
    });
    this.registry.setKnownTypes({ types });
    this.registry.register(types);
  }

  createType<T extends Codec = Codec>(typeIndex: number, payload: unknown): T {
    const type = this.regTypes.get(typeIndex);
    assert.notStrictEqual(type, undefined, `Type with index ${typeIndex} not found in registered types`);
    return this.registry.createType(type.name, payload);
  }

  getTypeDef(typeIndex: number | Si1LookupTypeId): string | Record<string, any>;

  getTypeDef(typeIndex: number | Si1LookupTypeId, additionalFields: false): string | Record<string, any>;

  getTypeDef(typeIndex: number | Si1LookupTypeId, additionalFields: true): TypeStructure;

  getTypeDef(
    typeIndex: number | Si1LookupTypeId,
    additionalFields?: boolean,
  ): string | Record<string, any> | TypeStructure;

  getTypeDef(
    typeIndex: number | Si1LookupTypeId,
    additionalFields = false,
  ): string | Record<string, any> | TypeStructure {
    const { def, path } = this.portableRegistry.getSiType(typeIndex);

    if (def.isPrimitive) {
      return additionalFields
        ? { name: def.asPrimitive.type, kind: 'primitive', type: def.asPrimitive.type }
        : def.asPrimitive.type;
    }

    if (path.length > 0 && path.at(0).toString() === 'primitive_types') {
      const type = this.getTypeName(typeIndex);
      return additionalFields ? { name: type, kind: 'primitive', type } : type;
    }

    if (def.isEmpty) {
      return additionalFields ? { name: '()', kind: 'empty', type: null } : null;
    }

    if (def.isNone) {
      return additionalFields ? { name: 'None', kind: 'none', type: null } : null;
    }

    if (def.isSequence) {
      return additionalFields
        ? {
            name: this.getTypeName(typeIndex),
            kind: 'sequence',
            type: this.getTypeDef(def.asSequence.type, additionalFields),
          }
        : [this.getTypeDef(def.asSequence.type, additionalFields)];
    }

    if (def.isTuple) {
      const tuple = def.asTuple.map((index) => this.getTypeDef(index, additionalFields));
      return additionalFields ? { name: this.getTypeName(typeIndex), kind: 'tuple', type: tuple } : tuple;
    }

    if (def.isArray) {
      const arrayType = this.getTypeDef(def.asArray.type, additionalFields);
      const len = def.asArray.len.toNumber();
      return additionalFields
        ? { name: this.getTypeName(typeIndex), kind: 'array', type: arrayType, len }
        : [arrayType, len];
    }

    if (def.isComposite) {
      let result: any = {};
      const name = this.getTypeName(typeIndex);
      if (name === 'ActorId') {
        return additionalFields ? { name, kind: 'actorid', type: 'actorid' } : name;
      }
      for (const { name, type } of def.asComposite.fields) {
        if (name.isSome) {
          result[name.unwrap().toString()] = this.getTypeDef(type, additionalFields);
          continue;
        }
        if (def.asComposite.fields.length === 1) {
          result = this.getTypeDef(type, additionalFields);
          return additionalFields ? { ...result, name: this.getTypeName(typeIndex) } : result;
        }
      }
      return additionalFields ? { name, kind: 'composite', type: result } : result;
    }

    if (def.isVariant) {
      const _variants = {};
      const name = this.getTypeName(typeIndex);

      for (const { name, fields } of def.asVariant.variants) {
        if (name.eq('None')) {
          _variants[name.toString()] = additionalFields ? { name: 'None', kind: 'none', type: null } : null;
          continue;
        }

        if (fields.length === 0) {
          _variants[name.toString()] = null;
          continue;
        }

        if (fields[0].name.isNone) {
          if (fields.length === 1) {
            _variants[name.toString()] = this.getTypeDef(fields[0].type, additionalFields);
          } else {
            const tuple = fields.map(({ type }) => this.getTypeDef(type, additionalFields));
            _variants[name.toString()] = additionalFields ? { name: null, kind: 'tuple', type: tuple } : tuple;
          }
        } else {
          const result = {};
          for (const { name, type } of fields) {
            result[name.unwrap().toString()] = this.getTypeDef(type, additionalFields);
          }
          _variants[name.toString()] = additionalFields ? { name: null, kind: 'composite', type: result } : result;
        }
      }

      return additionalFields
        ? {
            name,
            kind: isOption(name, def) ? 'option' : 'variant',
            type: _variants,
          }
        : { _variants };
    }
  }

  getTypeName(index: number | Si1LookupTypeId) {
    const { def, params, path } = this.portableRegistry.getSiType(index);

    if (def.isPrimitive) {
      return def.asPrimitive.toString();
    }

    if (def.isEmpty) {
      return '()';
    }

    if (def.isNone) {
      return 'None';
    }

    if (def.isSequence) {
      return `Vec<${this.getTypeName(def.asSequence.type)}>`;
    }

    if (def.isTuple) {
      return `(${def.asTuple.map((index) => this.getTypeName(index)).join(', ')})`;
    }

    if (def.isArray) {
      return `[${this.getTypeName(def.asArray.type)};${def.asArray.len.toNumber()}]`;
    }

    if (def.isComposite) {
      if (params.length > 0) {
        return `${path.at(-1)}<${params
          .map(({ type, name }) => (type.isSome ? this.getTypeName(type.unwrap()) : name.toString()))
          .join(', ')}>`;
      }
      return path.at(-1).toString();
    }

    if (def.isVariant) {
      if (params.length > 0) {
        return `${path.at(-1)}<${params
          .map(({ type, name }) => (type.isSome ? this.getTypeName(type.unwrap()) : name.toString()))
          .join(', ')}>`;
      }
      return this.portableRegistry.getName(index);
    }
  }

  getAllTypes() {
    return this.registry.knownTypes.types;
  }

  getTypeIndexByName(typeName: string): number | null {
    for (const [index, { name }] of this.regTypes.entries()) {
      if (name.toLowerCase() === typeName.toLowerCase()) {
        return index;
      }
    }
    return null;
  }
}
