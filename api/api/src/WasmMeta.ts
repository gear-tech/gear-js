import { Metadata } from './interfaces';

export async function getWasmMetadata(wasmBytes: Buffer): Promise<Metadata> {
  const memory = new WebAssembly.Memory({ initial: 256, maximum: 512 });
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
        console.log(msg);
      },
      gr_msg_id: () => {},
      gr_size: () => {},
      gr_read: () => {},
      gr_source: () => {},
      gr_gas_available: () => {},
      gr_send: () => {},
      gr_send_commit: () => {},
      gr_send_init: () => {},
      gr_send_push: () => {},
      gr_reply: () => {},
      gr_reply_push: () => {},
      gr_reply_to: () => {},
      gr_value: () => {},
      gr_wait: () => {},
      gr_wake: () => {},
    },
  };
  let metadata = {
    init_input: '',
    init_output: '',
    async_init_input: '',
    async_init_output: '',
    handle_input: '',
    handle_output: '',
    async_handle_input: '',
    async_handle_output: '',
    title: '',
    types: '',
  };

  let module = await WebAssembly.instantiate(wasmBytes, importObj);
  const instance = module.instance.exports;
  if (!instance) {
    return metadata;
  }
  metadata.types = `0x${readMeta(memory, instance.meta_registry)}`;
  metadata.init_input = readMeta(memory, instance.meta_init_input);
  metadata.init_output = readMeta(memory, instance.meta_init_output);
  metadata.async_init_input = readMeta(memory, instance.meta_async_init_input);
  metadata.async_init_output = readMeta(memory, instance.meta_async_init_output);
  metadata.handle_input = readMeta(memory, instance.meta_handle_input);
  metadata.handle_output = readMeta(memory, instance.meta_handle_output);
  metadata.async_handle_input = readMeta(memory, instance.meta_async_handle_input);
  metadata.async_handle_output = readMeta(memory, instance.meta_async_handle_output);
  metadata.title = readMeta(memory, instance.meta_title);

  return metadata;
}

function readMeta(memory: WebAssembly.Memory, ptr: any): string {
  if (!ptr) {
    return '';
  }
  ptr = ptr();
  let pointer = new Uint32Array(memory.buffer.slice(ptr, ptr + 4))[0];

  let length = new Uint32Array(memory.buffer.slice(ptr + 4, ptr + 8))[0];

  let buf = memory.buffer.slice(pointer, pointer + length);
  return ab2str(buf);
}

function ab2str(buf: ArrayBuffer): string {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
