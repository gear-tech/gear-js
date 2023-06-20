import { u32 } from '@polkadot/types';

export interface IGearPages {
  [key: string]: Uint8Array;
}

export type WasmPageNumber = u32;

export type GearPageNumber = u32;
