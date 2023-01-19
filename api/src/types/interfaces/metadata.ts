import { Vec, u8, u32, Text, Option, Struct, BTreeMap } from '@polkadot/types';
import { HexString } from '@polkadot/util/types';

export interface OldMetadata {
  init_input?: string;
  init_output?: string;
  async_init_input?: string;
  async_init_output?: string;
  handle_input?: string;
  handle_output?: string;
  async_handle_input?: string;
  async_handle_output?: string;
  title?: string;
  types?: HexString;
  meta_state_input?: string;
  meta_state_output?: string;
}

export interface TypesRepr extends Struct {
  input: Option<u32>;
  output: Option<u32>;
  toJSON: () => HumanTypesRepr;
}

export type HumanTypesRepr = {
  input?: number;
  output?: number;
};

export interface ProgramMetadataRepr extends Struct {
  init: TypesRepr;
  handle: TypesRepr;
  reply: TypesRepr;
  others: TypesRepr;
  signal: Option<u32>;
  state: Option<u32>;
  reg: Vec<u8>;
  toJSON: () => HumanProgramMetadataRepr;
}

export type HumanProgramMetadataRepr = {
  init: HumanTypesRepr;
  handle: HumanTypesRepr;
  reply: HumanTypesRepr;
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
