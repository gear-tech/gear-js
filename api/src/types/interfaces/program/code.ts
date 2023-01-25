import { BTreeSet, Option, Struct, Vec, u32, u8 } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';

import { DispatchKind } from '../message';
import { WasmPageNumber } from './pages';

export interface CodeMetadata extends Struct {
  author: H256;
  blockNumber: u32;
}

export interface InstrumentedCode extends Struct {
  code: Vec<u8>;
  exports: BTreeSet<DispatchKind>;
  staticPages: WasmPageNumber;
  version: u32;
}

export type CodeStorage = Option<InstrumentedCode>;
