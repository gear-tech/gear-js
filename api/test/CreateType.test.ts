import { CreateType, getWasmMetadata, decodeHexTypes } from '../src';
import yaml from 'js-yaml';
import fs from 'fs';
import { join } from 'path';
import { TEST_WASM_DIR } from './config';

const testFiles = fs.readdirSync('test/spec/meta');

describe('Create type test', () => {
  for (let filePath of testFiles) {
    const testFile = yaml.load(fs.readFileSync(join('./test/spec/meta', filePath), 'utf8'));
    test(testFile.title, async () => {
      const metaFile = fs.readFileSync(join(TEST_WASM_DIR, testFile.file));
      const meta = await getWasmMetadata(metaFile);
      for (let type in testFile.types) {
        expect(meta[type]).toBe(testFile.types[type]);
      }
      expect(decodeHexTypes(meta.types)).toEqual(testFile.displayed_types);
      const createType = new CreateType();
      const encode = testFile.payloads.encode;
      for (let payloadType in encode) {
        for (let index in encode[payloadType]) {
          const payload = encode[payloadType][index];
          const encoded = createType.create(meta[payloadType], payload.payload, meta);
          expect(encoded.toHex()).toEqual(payload.expected);
        }
      }
      const decode = testFile.payloads.decode;
      for (let payloadType in decode) {
        for (let index in decode[payloadType]) {
          const payload = decode[payloadType][index];
          const encoded = createType.create(meta[payloadType], payload.payload, meta);
          expect(encoded.toHuman()).toEqual(payload.expected);
        }
      }
    });
  }
});
