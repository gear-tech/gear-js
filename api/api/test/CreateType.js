const assert = require('assert');
const { CreateType, getWasmMetadata, parseHexTypes } = require('../lib');
const yaml = require('js-yaml');
const fs = require('fs');
const { join } = require('path');
const { describe } = require('mocha');

const testFiles = fs.readdirSync('test/spec/meta');

for (filePath of testFiles) {
  const test = yaml.load(fs.readFileSync(join('./test/spec/meta', filePath), 'utf8'));
  describe(test.title, () => {
    before(async () => {
      const metaFile = fs.readFileSync(join(process.env.EXAMPLES_DIR, test.file));
      this.meta = await getWasmMetadata(metaFile);
    });
    for (type in test.types) {
      it(type, () => {
        assert.equal(this.meta[type], test.types[type]);
      });
    }
    it('Displayed types', () => {
      assert.deepEqual(parseHexTypes(this.meta.types), test.displayed_types);
    });
    const createType = new CreateType();
    for (payloadType in test.payloads) {
      for (index in test.payloads[payloadType]) {
        const payload = test.payloads[payloadType][index];
        it(`CreateType => ${payload.name}`, () => {
          console.log(payloadType);
          console.log(this.meta);
          const encoded = createType.create(this.meta[payloadType], payload.payload, this.meta);
          assert.deepEqual(encoded.toHuman(), payload.payload);
        });
      }
    }
  });
}
