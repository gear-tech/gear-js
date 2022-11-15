import { u64 } from '@polkadot/types';
import { BlockNumber } from '@polkadot/types/interfaces';

export default (
  memory: WebAssembly.Memory,
  showDebug?: boolean,
  inputValue?: Uint8Array,
  timestamp?: u64,
  block_height?: BlockNumber,
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
    gr_block_height: () => block_height,
    gr_block_timestamp: () => timestamp,
    gr_exit: () => {},
    gr_reserve_gas: () => {},
    gr_unreserve_gas: () => {},
    gr_gas_available: () => {},
    gr_program_id: () => {},
    gr_origin: () => {},
    gr_random: () => {},
    gr_leave: () => {},
    gr_value_available: () => {},
    gr_wait: () => {},
    gr_wait_up_to: () => {},
    gr_wait_for: () => {},
    gr_wake: () => {},
    gr_exit_code: () => {},
    gr_message_id: () => {},
    gr_read: (at: number, len: number, dest: number) => {
      new Uint8Array(memory.buffer).set(inputValue.slice(at, len), dest);
    },
    gr_reply: () => {},
    gr_reply_wgas: () => {},
    gr_reply_commit: () => {},
    gr_reply_commit_wgas: () => {},
    gr_reservation_reply: () => {},
    gr_reservation_reply_commit: () => {},
    gr_reply_push: () => {},
    gr_reply_to: () => {},
    gr_send: () => {},
    gr_send_wgas: () => {},
    gr_send_commit: () => {},
    gr_send_commit_wgas: () => {},
    gr_send_init: () => {},
    gr_send_push: () => {},
    gr_reservation_send: () => {},
    gr_reservation_send_commit: () => {},
    gr_size: () => {
      return inputValue.byteLength;
    },
    gr_source: () => {},
    gr_value: () => {},
    gr_debug: (msg: string) => {
      showDebug && console.log('GR_DEBUG: ', msg);
    },
    gr_create_program_wgas: () => {},
    gr_create_program: () => {},
    gr_error: () => {},
  },
});
