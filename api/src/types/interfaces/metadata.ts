import { Vec, HashMap, u8, u32, Text, Option, Struct } from '@polkadot/types';
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

export interface ProgramMetadata extends Struct {
  init: TypesRepr;
  handle: TypesRepr;
  reply: TypesRepr;
  others: TypesRepr;
  state: Option<u32>;
  reg: Vec<u8>;
  toJSON: () => HumanProgramMetadata;
}

export type HumanProgramMetadata = {
  init: HumanTypesRepr;
  handle: HumanTypesRepr;
  reply: HumanTypesRepr;
  others: HumanTypesRepr;
  state: number | null;
  reg: HexString;
};

export interface StateMetadata extends Struct {
  functions: HashMap<Text, TypesRepr>;
  reg: Vec<u8>;
  toJSON: () => HumanStateMetadata;
}

export type HumanStateMetadata = {
  functions: Record<string, HumanTypesRepr>;
  reg: HexString;
};
