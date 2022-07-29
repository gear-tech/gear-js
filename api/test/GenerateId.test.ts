import { generateCodeId, generateProgramId, Hex } from '../src';
import { TEST_WASM_DIR } from './config';
import { readFileSync } from 'fs';
import { join } from 'path';

const pingCode = readFileSync(join(TEST_WASM_DIR, 'demo_ping.opt.wasm'));
let codeId: Hex;

describe('Generate IDs', () => {
  test('codeHash', async () => {
    expect(generateCodeId(Buffer.from('0x12345678'))).toBe(
      '0x9949f8eeff109e7e24579bfc260ac04a5b4f6a7cad291e4af8cd789e0c5ec26f',
    );
  });

  test('programId', async () => {
    expect(generateProgramId(Buffer.from('0x12345678'), '0x1234')).toBe(
      '0xd3bd038bdf4a403a1209eebdfb6dc9f05b8e70cae93fc3a038a76175893ba8ca',
    );
  });

  test('demo_ping CodeHash', () => {
    codeId = generateCodeId(pingCode);
    expect(codeId).toBe('0x4b701fedb61456cd75df8ae6348f73aa9f529f2363f9ce76398f14aba15f01d6');
  });

  test('demo_ping ProgramId', () => {
    const programId = generateProgramId(pingCode, '1234');
    expect(programId).toBe('0x20b5c1306227dd23c184c98634d440ab50108af0793b5c5b5b1affd0e3487ab0');
  });

  test('programId using codeId', () => {
    const programId = generateProgramId(codeId, '1234');
    expect(programId).toBe('0x20b5c1306227dd23c184c98634d440ab50108af0793b5c5b5b1affd0e3487ab0');
  });
});
