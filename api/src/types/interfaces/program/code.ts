import { Codec } from '@polkadot/types-codec/types';
import { H256 } from '@polkadot/types/interfaces';
import { u8, u32, Option, BTreeSet, Vec } from '@polkadot/types';
import { WasmPageNumber } from './pages';
import { DispatchKind } from '../message';

export interface CodeMetadata extends Codec {
  author: H256;
  blockNumber: u32;
}

export interface InstrumentedCode extends Codec {
  code: Vec<u8>;
  exports: BTreeSet<DispatchKind>;
  staticPages: WasmPageNumber;
  version: u32;
}

export type CodeStorage = Option<InstrumentedCode>;
