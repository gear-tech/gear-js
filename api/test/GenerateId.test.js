const { generateCodeHash, generateProgramId } = require('../lib');
const { readFileSync } = require('fs');

const pingCode = readFileSync('test/wasm/demo_ping.opt.wasm');

describe('Generate IDs', () => {
  test('generate codeHash', async () => {
    expect(generateCodeHash(Buffer.from('0x12345678'))).toBe(
      '0x9949f8eeff109e7e24579bfc260ac04a5b4f6a7cad291e4af8cd789e0c5ec26f',
    );
  });

  test('generate programId', async () => {
    expect(generateProgramId(Buffer.from('0x12345678'), '0x1234')).toBe(
      '0xd3bd038bdf4a403a1209eebdfb6dc9f05b8e70cae93fc3a038a76175893ba8ca',
    );
  });

  test('demo_ping CodeHash', () => {
    const codeHash = generateCodeHash(pingCode);
    expect(codeHash).toBe('0x5615e1236f66d3ea62c0471bb6f1ed0ba2c952cd482a1d06491f6919316d1baa');
  });

  test('ping ProgramId', () => {
    const programId = generateProgramId(pingCode, '1234');
    expect(programId).toBe('0xdb9e230be5236abc12453959d468af2615affd393c814aa8ea7d6b58d580e990');
  });
});
