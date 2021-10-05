import { Metadata } from './interfaces/metadata';

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
        element: 'anyfunc'
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
      gr_wake: () => {}
    }
  };
  let metadata = {
    init_input: '',
    init_output: '',
    input: '',
    output: '',
    title: '',
    types: ''
  };

  let module = await WebAssembly.instantiate(wasmBytes, importObj);
  const instance = module.instance.exports;
  metadata.types = instance?.meta_registry ? `0x${readMeta(memory, instance.meta_registry)}` : '';
  metadata.init_input = instance?.meta_init_input ? readMeta(memory, instance.meta_init_input) : '';
  metadata.init_output = instance?.meta_init_output ? readMeta(memory, instance.meta_init_output) : '';
  metadata.input = instance?.meta_input ? readMeta(memory, instance.meta_input) : '';
  metadata.output = instance?.meta_output ? readMeta(memory, instance.meta_output) : '';
  metadata.title = instance?.meta_title ? readMeta(memory, instance.meta_title) : '';

  return metadata;
}

function readMeta(memory, ptr) {
  ptr = ptr();
  let length = memory.buffer.slice(ptr + 4, ptr + 8);
  length = new Uint32Array(length)[0];

  let pointer = memory.buffer.slice(ptr, ptr + 4);
  pointer = new Uint32Array(pointer)[0];

  let buf = memory.buffer.slice(pointer, pointer + length);
  return ab2str(buf);
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
