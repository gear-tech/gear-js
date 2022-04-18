const memory = new WebAssembly.Memory({ initial: 256 });

export default {
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
  gr_block_height: () => {},
  gr_block_timestamp: () => {},
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
  gr_read: () => {},
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
  gr_size: () => {},
  gr_source: () => {},
  gr_value: () => {},
  gr_create_program_wgas: () => {},
  gr_debug: () => {},
};
