import { cpSync, readFileSync, writeFileSync } from 'fs';
import { Target } from 'interfaces';
import { join } from 'path';

export function replaceEnvImport(filePath: string, target: Target): void {
  let data = readFileSync(filePath).toString();
  if (target === 'nodejs') {
    data = data.replace(`require('env')`, `require('./env.js')`);
  } else if (target === 'web') {
    data = data.replace(`import * as __wbg_star0 from 'env';`, `import __wbg_star0 from './env.js';`);
    data = data.replace(`const imports = {};`, `const imports = { wbg: {} };`);
  }
  writeFileSync(filePath, data);
}

export function writeEnvFile(pkgPath: string, target: Target): void {
  writeFileSync(
    join(pkgPath, 'env.js'),
    `const memory = new WebAssembly.Memory({ initial: 256 });

  ${target === 'nodejs' ? 'module.exports =' : 'export default'} {
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
  `,
  );
}
