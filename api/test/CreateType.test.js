const { CreateType, getWasmMetadata, parseHexTypes } = require('../lib');
const yaml = require('js-yaml');
const fs = require('fs');
const { join } = require('path');

const testFiles = fs.readdirSync('test/spec/meta');

describe('Create type test', () => {
  for (let filePath of testFiles) {
    const testFile = yaml.load(fs.readFileSync(join('./test/spec/meta', filePath), 'utf8'));
    test(testFile.title, async () => {
      const metaFile = fs.readFileSync(join(process.env.EXAMPLES_DIR, testFile.file));
      const meta = await getWasmMetadata(metaFile);
      for (let type in testFile.types) {
        expect(meta[type]).toBe(testFile.types[type]);
      }
      expect(parseHexTypes(meta.types)).toEqual(testFile.displayed_types);
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
