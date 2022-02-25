export function readMetaValue(memory: WebAssembly.Memory, func: any): string {
  return ab2str(getExportValue(memory, func));
}

export function getExportValue(memory: WebAssembly.Memory, func: any): ArrayBuffer {
  if (!func) {
    return undefined;
  }
  let result_ptr = func();
  let pointer = new Uint32Array(memory.buffer.slice(result_ptr, result_ptr + 4))[0];
  let length = new Uint32Array(memory.buffer.slice(result_ptr + 4, result_ptr + 8))[0];
  let buf = memory.buffer.slice(pointer, pointer + length);
  return buf;
}

export function ab2str(buf: ArrayBuffer): string {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
