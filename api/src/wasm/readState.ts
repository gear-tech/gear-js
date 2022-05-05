import { IGearPages } from '../types/interfaces';
import importObj from './importObj';
import { getExportValue, PAGE_SIZE } from './utils';
import { u64, Compact } from '@polkadot/types';

export async function readState(
  wasmBytes: Buffer,
  initialSize: number,
  pages: IGearPages,
  inputValue?: Uint8Array,
  blockTimestamp?: Compact<u64>,
): Promise<Uint8Array> {
  const memory = new WebAssembly.Memory({ initial: initialSize });
  const module = await WebAssembly.instantiate(wasmBytes, importObj(memory, false, inputValue, blockTimestamp));
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
