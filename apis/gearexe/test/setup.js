import * as fs from 'fs';
import { config } from 'dotenv';
import { generateCodeHash } from '@gear-js/api';

config();

export default () => {
  const code = fs.readFileSync('target/wasm32-gear/release/counter.opt.wasm');
  const codeId = generateCodeHash(code);

  process.env['CODE_ID'] = codeId;
};
