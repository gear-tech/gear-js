import { IGearPages } from '..';
import importObj from './importObj';
import { getExportValue, getInitialLength, PAGE_SIZE } from './utils';

export async function readState(wasmBytes: Buffer, pages: IGearPages, inputValue?: Uint8Array): Promise<Uint8Array> {
  const memory = new WebAssembly.Memory({ initial: getInitialLength(pages) });
  const module = await WebAssembly.instantiate(wasmBytes, importObj(memory, false, inputValue));
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
