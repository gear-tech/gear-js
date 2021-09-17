import * as fs from 'fs';
import { getWasmMetadata, CreateType } from '../src';

async function testMeta(test: any) {
  let meta;
  let types;
  if (test.meta_file) {
    meta = await getWasmMetadata(fs.readFileSync(test.meta_file));
    types = meta.types;
  } else {
    types = {
      init_input: test.types.init_input,
      init_output: test.types.init_output,
      input: test.types.input,
      output: test.types.output
    }
  }
  
  test.payloads.forEach((payload) => {
    const encoded = CreateType.encode(meta[payload.name], payload.value, meta);
    const decoded: object = CreateType.decode(meta[payload.name], encoded, meta).toJSON();
    console.log(`${JSON.stringify(decoded)}: ${assert(payload.value, decoded)}`);
  });
}

function assert(payload: object, decoded: object) {
  Object.getOwnPropertyNames(payload).forEach((key) => {
    if (typeof payload[key] === 'object') {
      if (decoded[key]) {          
        assert(payload[key], decoded[key]);
      } else {
        throw new Error('Assertion failed');
      }
    } else {
      if (!(payload[key] === decoded[key])) {
        throw new Error('Assertion failed');
      }
    }
  });
  return 'ok';
}

async function main(path: string) {
  const settings = JSON.parse(fs.readFileSync(path).toString());

  for (const element of settings) {
    await testMeta(element);
  }
}

main('./examples/test-meta.json').catch((error) => {
  console.error(error);
});
