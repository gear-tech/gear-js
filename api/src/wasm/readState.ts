import { u64 } from '@polkadot/types';
import { u8aToHex } from '@polkadot/util';
import { BlockNumber } from '@polkadot/types/interfaces';

import { getExportValue, PAGE_SIZE } from './utils';
import { Hex, IGearPages } from '../types';
import importObj from './importObj';

export async function readState(
  wasmBytes: Buffer,
  initialSize: number,
  pages: IGearPages,
  inputValue?: Uint8Array,
  blockTimestamp?: u64,
  blockNumber?: BlockNumber,
): Promise<Uint8Array> {
  const memory = new WebAssembly.Memory({ initial: initialSize });
  const module = await WebAssembly.instantiate(
    wasmBytes,
    importObj(memory, false, inputValue, blockTimestamp, blockNumber),
  );
  Object.keys(pages).forEach((pageNumber: string) => {
    const start = +pageNumber * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const page = pages[pageNumber];
    for (let i = start; i < end; i++) {
      new Uint8Array(memory.buffer)[i] = page[i % PAGE_SIZE];
    }
  });
  const { exports } = module.instance;
  return exports?.meta_state ? new Uint8Array(getExportValue(memory, exports.meta_state)) : null;
}

export async function getStateFunctions(wasmBytes: Buffer): Promise<Hex> {
  const memory = new WebAssembly.Memory({ initial: 17 });

  let result: Hex;

  const module = await WebAssembly.instantiate(
    wasmBytes,
    importObj(memory, undefined, undefined, undefined, undefined, (metadata: Uint8Array) => {
      result = u8aToHex(metadata);
    }),
  );

  const { exports } = module.instance;
  if (!exports?.metadata) {
    throw new Error('Unable to find exports in applied wasm');
  }

  if (typeof exports.metadata !== 'function') {
    throw new Error('exports.metadata is not a function');
  }

  exports.metadata();

  return result;
}
