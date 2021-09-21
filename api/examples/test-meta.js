const assert = require('assert');
const { CreateType, getWasmMetadata } = require('../lib/src');
const fs = require('fs')

describe('Create custom types test', () => {

    const testMeta = (test) => {
        describe(test.meta_file, () => {
            test.payloads.forEach(async (payload) => {
                const meta = await getWasmMetadata(fs.readFileSync(test.meta_file));
                it(`${payload.name}: ${meta[payload.name]}`, () => {
                    const encoded = CreateType.encode(meta[payload.name], payload.value, meta);
                    const decoded = CreateType.decode(meta[payload.name], encoded, meta);
                    assert.ok(decoded.eq(payload.value), `expected: ${JSON.stringify(payload.value)}, recieved: ${JSON.stringify(decoded.toJSON())}`)
                })

            });
        })
    }

    const settings = JSON.parse(fs.readFileSync(process.env.GEAR_TEST_META || './examples/test-meta.json').toString())

    for (const element of settings) {
        testMeta(element);
    }
})


function check(payload, decoded) {
    Object.getOwnPropertyNames(payload).forEach((key) => {
        if (typeof payload[key] === 'object') {
            if (decoded[key.toLowerCase()]) {
                assert(payload[key], decoded[key.toLowerCase()]);
            } else {
                throw new Error('Assertion failed');
            }
        } else {
            if (!(payload[key] === decoded[key.toLowerCase()])) {
                throw new Error('Assertion failed');
            }
        }
    });
    return 'ok';
}
