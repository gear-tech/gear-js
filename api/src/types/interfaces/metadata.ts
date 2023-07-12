import { BTreeMap, Option, Struct, Text, Vec, u32, u8 } from '@polkadot/types';
import { HexString } from '@polkadot/util/types';

export interface TypesRepr extends Struct {
  input: Option<u32>;
  output: Option<u32>;
  toJSON: () => HumanTypesRepr;
}

export type HumanTypesRepr = {
  input: number | null;
  output: number | null;
};

export interface ProgramMetadataRepr extends Struct {
  init: TypesRepr;
  handle: TypesRepr;
  others: TypesRepr;
  reply: Option<u32>;
  signal: Option<u32>;
  state: Option<u32>;
  reg: Vec<u8>;
  toJSON: () => HumanProgramMetadataRepr;
}

export type HumanProgramMetadataRepr = {
  init: HumanTypesRepr;
  handle: HumanTypesRepr;
  reply: number | null;
  others: HumanTypesRepr;
  signal: number | null;
  state: number | null;
  reg: HexString;
};

export interface StateMetadataRepr extends Struct {
  functions: BTreeMap<Text, TypesRepr>;
  reg: Vec<u8>;
  toJSON: () => HumanStateMetadataRepr;
}

export type HumanStateMetadataRepr = {
  functions: Record<string, HumanTypesRepr>;
  reg: HexString;
};

export type StateFunctions = Record<string, HumanTypesRepr>;

export type TypeKind =
  | 'primitive'
  | 'empty'
  | 'none'
  | 'sequence'
  | 'composite'
  | 'variant'
  | 'array'
  | 'tuple'
  | 'option'
  | 'actorid';

export interface TypeStructure {
  name: string;
  kind: TypeKind;
  type: string | object | TypeStructure;
  len?: number;
}
