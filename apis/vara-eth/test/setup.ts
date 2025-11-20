import * as fs from 'fs';
import { config } from 'dotenv';
import { generateCodeHash } from '../src/util/hash';

if (typeof WebSocket === 'undefined') {
  import('ws').then((module) => {
    global.WebSocket = module.default as any;
  });
}

config();

export default () => {
  const code = fs.readFileSync('target/wasm32-gear/release/counter.opt.wasm');
  const codeId = generateCodeHash(code);

  console.log(`Generated code id: ${codeId}`);
  process.env['CODE_ID'] = codeId;
};
