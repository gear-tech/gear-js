import { Metadata } from './interfaces';

export async function getWasmMetadata(
  wasmBytes: Buffer,
  showDebug = false,
  pages?: any,
  inputValue?: Uint8Array,
): Promise<Metadata> {
  const memory = new WebAssembly.Memory({ initial: pages ? Object.keys(pages).length : 256 });
  const importObj = {
    env: {
      abortStackOverflow: () => {
        throw new Error('overflow');
      },
      table: new WebAssembly.Table({
        initial: 0,
        maximum: 0,
        element: 'anyfunc',
      }),
      tableBase: 0,
      memory: memory,
      memoryBase: 1024,
      STACKTOP: 0,
      STACK_MAX: memory.buffer.byteLength,
      alloc: (pages) => {
        return memory.grow(pages);
      },
      free: (_pages) => {},
      gr_debug: (msg) => {
        showDebug && console.log('GR_DEBUG: ', msg);
      },
      gr_exit_code: () => {},
      gr_msg_id: () => {},
      gr_read: (at: number, len: number, dest: number) => {
        new Uint8Array(memory.buffer).set(inputValue.slice(at, len), dest);
      },
      gr_reply: () => {},
      gr_reply_commit: () => {},
      gr_reply_push: () => {},
      gr_reply_to: () => {},
      gr_send: () => {},
      gr_send_commit: () => {},
      gr_send_init: () => {},
      gr_send_push: () => {},
      gr_size: () => {
        return inputValue.byteLength;
      },
      gr_source: () => {},
      gr_value: () => {},
      gr_block_height: () => {},
      gr_block_timestamp: () => {},
      gr_gas_available: () => {},
      gr_wait: () => {},
      gr_wake: () => {},
    },
  };

  let module = await WebAssembly.instantiate(wasmBytes, importObj);
  pages &&
    Object.keys(pages).forEach((pageNumber: string) => {
      const start = +pageNumber * 65536;
      const end = start + 65536;
      const page = pages[pageNumber];
      for (let i = start; i < end; i++) {
        new Uint8Array(memory.buffer)[i] = page[i % 65536];
      }
    });
  const exports = module.instance.exports;
  if (!exports) {
    return {};
  }
  let metadata: Metadata = {
    types: `0x${readMeta(memory, exports.meta_registry)}`,
    init_input: readMeta(memory, exports.meta_init_input),
    init_output: readMeta(memory, exports.meta_init_output),
    async_init_input: readMeta(memory, exports.meta_async_init_input),
    async_init_output: readMeta(memory, exports.meta_async_init_output),
    handle_input: readMeta(memory, exports.meta_handle_input),
    handle_output: readMeta(memory, exports.meta_handle_output),
    async_handle_input: readMeta(memory, exports.meta_async_handle_input),
    async_handle_output: readMeta(memory, exports.meta_async_handle_output),
    title: readMeta(memory, exports.meta_title),
    meta_state_input: readMeta(memory, exports.meta_state_input),
    meta_state_output: readMeta(memory, exports.meta_state_output),
    meta_state: pages ? readState(memory, exports.meta_state) : undefined,
  };
  return metadata;
}

function readMeta(memory: WebAssembly.Memory, func: any): string {
  return ab2str(readMetaValue(memory, func));
}

function readState(memory: WebAssembly.Memory, func: any): Uint8Array {
  return new Uint8Array(readMetaValue(memory, func));
}

function readMetaValue(memory: WebAssembly.Memory, func: any): ArrayBuffer {
  if (!func) {
    return undefined;
  }
  let result_ptr = func();
  let pointer = new Uint32Array(memory.buffer.slice(result_ptr, result_ptr + 4))[0];
  let length = new Uint32Array(memory.buffer.slice(result_ptr + 4, result_ptr + 8))[0];
  let buf = memory.buffer.slice(pointer, pointer + length);
  return buf;
}

function ab2str(buf: ArrayBuffer): string {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
