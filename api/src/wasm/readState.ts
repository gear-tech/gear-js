import { IGearPages } from '..';
import importObj from './importObj';
import { getExportValue, getInitialLength } from './utils';

export async function readState(wasmBytes: Buffer, pages: IGearPages, inputValue?: Uint8Array): Promise<Uint8Array> {
  const memory = new WebAssembly.Memory({ initial: getInitialLength(pages) });
  const module = await WebAssembly.instantiate(wasmBytes, importObj(memory, false, inputValue));
  Object.keys(pages).forEach((pageNumber: string) => {
    const start = +pageNumber * 65536;
    const end = start + 65536;
    const page = pages[pageNumber];
    for (let i = start; i < end; i++) {
      new Uint8Array(memory.buffer)[i] = page[i % 65536];
    }
  });
  const { exports } = module.instance;
  return exports?.meta_state ? new Uint8Array(getExportValue(memory, exports.meta_state)) : null;
}
