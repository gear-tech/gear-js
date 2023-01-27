import { BlockNumber } from '@polkadot/types/interfaces';
import { u64 } from '@polkadot/types';

import { PAGE_SIZE, getExportValue } from './utils';
import { IGearPages } from '../types';
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
    importObj(memory, true, inputValue, blockTimestamp, blockNumber),
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
