import { IGearPages } from '../types/interfaces';

export function readMetaValue(memory: WebAssembly.Memory, func: any): string {
  return ab2str(getExportValue(memory, func));
}

export function getExportValue(memory: WebAssembly.Memory, func: any): ArrayBuffer {
  if (!func) {
    return undefined;
  }
  const result_ptr = func();
  const pointer = new Uint32Array(memory.buffer.slice(result_ptr, result_ptr + 4))[0];
  const length = new Uint32Array(memory.buffer.slice(result_ptr + 4, result_ptr + 8))[0];
  const buf = memory.buffer.slice(pointer, pointer + length);
  return buf;
}

export function ab2str(buf: ArrayBuffer): string {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

export function getInitialLength(pages: IGearPages) {
  return (
    parseInt(
      Object.keys(pages).reduce((prev, cur) => {
        if (parseInt(cur) > parseInt(prev)) {
          return cur;
        }
        return prev;
      }),
    ) + 1
  );
}

export const PAGE_SIZE = 4096;
