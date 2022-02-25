const { generateCodeHash, generateProgramId } = require('../lib');

describe('Generate IDs', () => {
  test('generate codeHash', async () => {
    expect(generateCodeHash(Buffer.from('0x12345678'))).toBe(
      '0x9949f8eeff109e7e24579bfc260ac04a5b4f6a7cad291e4af8cd789e0c5ec26f',
    );
  });

  test('generate programId', async () => {
    expect(generateProgramId(Buffer.from('0x12345678'), '0x1234')).toBe(
      '0x1d54c1a17c7c3b23579fe9fde5fb8dc40099ee9afbb3a25f13c75766cf92bbc5',
    );
  });
});
