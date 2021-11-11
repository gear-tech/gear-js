const assert = require('assert');
const { CreateType, getWasmMetadata, parseHexTypes } = require('../lib');
const yaml = require('js-yaml');
const fs = require('fs');
const { join } = require('path');
const { describe } = require('mocha');

async function getMetaTest(name, meta, testTypes, displayedTypes) {
  describe(name, () => {
    Object.keys(testTypes).forEach((key) => {
      it(key, () => {
        assert.deepEqual(meta[key], testTypes[key]);
      });
    });
    it('Displayed types', () => {
      assert.deepEqual(parseHexTypes(meta.types), displayedTypes);
    });
  });
}

function payloadsTest(name, payloads, meta) {
  describe(name, () => {
    describe('Encode', () => {
      const encode = payloads.encode;
      Object.keys(encode).forEach((key) => {
        describe(key, () => {
          encode[key].forEach(({ name, type, payload }) => {
            const encoded = CreateType.encode(type, payload, meta);
            const decoded = CreateType.decode(type, encoded, meta);
            it(name, () => {
              assert.deepEqual(decoded.toHuman(), payload);
            });
          });
        });
      });
    });
  });
}

describe('Get metadata', function () {
  const tests = yaml.load(fs.readFileSync('./test/spec/meta.yaml', 'utf8'));
  const testFiles = tests.files;
  testFiles.forEach(async function (test) {
    const metaFile = fs.readFileSync(join(process.env.EXAMPLES_DIR, test.name));
    const testTypes = test.types;
    const meta = await getWasmMetadata(metaFile);
    await getMetaTest(test.name, meta, testTypes, test.displayed_types);
    if (test.payloads) {
      payloadsTest(test.name, test.payloads, meta);
    }
  });
});

// describe('Create custom types test', () => {
//   function checkPayload(payload, decoded) {
//     Object.getOwnPropertyNames(payload).forEach((key) => {
//       if (typeof payload[key] === 'object') {
//         if (decoded[key]) {
//           assert(payload[key], decoded[key]);
//         } else {
//           return false;
//         }
//       } else {
//         if (!(payload[key] === decoded[key])) {
//           return false;
//         }
//       }
//     });
//     return true;
//   }
//   const meta = {
//     types: {
//       Id: { decimal: 'u64', hex: 'Vec<u8>' },
//       MessageIn: { id: 'Id' },
//       MessageInitIn: { amount: 'u8', currency: 'Vec<u8>' },
//       MessageInitOut: { exchange_rate: 'Result<u8,u8>', sum: 'u8' },
//       MessageOut: { res: 'Vec<Result<Wallet,Vec<u8>>>' },
//       Person: {
//         name: 'String',
//         patronymic: 'Option<String>',
//         surname: 'String',
//       },
//       Wallet: { id: 'Id', person: 'Person' },
//     },
//   };
//   it('MessageInitIn', () => {
//     const payload = { amount: 8, currency: 'USD' };
//     const encoded = CreateType.encode('MessageIn', payload, meta);
//     const decoded = CreateType.decode('MessageIn', encoded, meta);
//     assert.ok(checkPayload(payload, decoded.toJSON()));
//   });
//   it('MessageInitOut', () => {
//     const payload = {
//       exchange_rate: {
//         err: 1,
//       },
//       sum: 31,
//     };
//     const encoded = CreateType.encode('MessageIn', payload, meta);
//     const decoded = CreateType.decode('MessageIn', encoded, meta);
//     assert.ok(checkPayload(payload, decoded.toJSON()));
//   });
//   it('MessageIn', () => {
//     const payload = { decimal: 1234, hex: '0x514365' };
//     const encoded = CreateType.encode('MessageIn', payload, meta);
//     const decoded = CreateType.decode('MessageIn', encoded, meta);
//     assert.ok(checkPayload(payload, decoded.toJSON()));
//   });

//   it('MessageOut', () => {
//     const payload = {
//       res: [
//         {
//           ok: {
//             id: {
//               decimal: 1,
//               hex: '0x31',
//             },
//             person: {
//               name: 'Name',
//               patronymic: null,
//               surname: 'Surname',
//             },
//           },
//         },
//       ],
//     };
//     const encoded = CreateType.encode('MessageOut', payload, meta);
//     const decoded = CreateType.decode('MessageOut', encoded, meta);
//     assert.ok(checkPayload(payload, decoded.toJSON()));
//   });
// });
