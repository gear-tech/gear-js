import { u64, Compact } from '@polkadot/types';

export default (
  memory: WebAssembly.Memory,
  showDebug?: boolean,
  inputValue?: Uint8Array,
  timestamp?: Compact<u64>,
) => ({
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
    alloc: (pages: number) => {
      return memory.grow(pages);
    },
    free: () => {},
    gr_block_height: () => {},
    gr_block_timestamp: () => timestamp,
    gr_exit: () => {},
    gr_gas_available: () => {},
    gr_program_id: () => {},
    gr_origin: () => {},
    gr_leave: () => {},
    gr_value_available: () => {},
    gr_wait: () => {},
    gr_wake: () => {},
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
    gr_send_wgas: () => {},
    gr_send_commit: () => {},
    gr_send_commit_wgas: () => {},
    gr_send_init: () => {},
    gr_send_push: () => {},
    gr_size: () => {
      return inputValue.byteLength;
    },
    gr_source: () => {},
    gr_value: () => {},
    gr_create_program_wgas: () => {},
    gr_debug: (msg: string) => {
      showDebug && console.log('GR_DEBUG: ', msg);
    },
    gr_error: () => {},
  },
});
