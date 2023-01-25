import { join } from 'path';
import { readFileSync } from 'fs';
import { u8aToHex } from '@polkadot/util';

import { Hex, generateCodeHash, generateProgramId } from '../src';
import { TEST_WASM_DIR } from './config';

const pingCode = readFileSync(join(TEST_WASM_DIR, 'demo_ping.opt.wasm'));
let codeId: Hex;

describe('Generate IDs', () => {
  test('demo_ping codeHash', () => {
    codeId = generateCodeHash(pingCode);
    expect(codeId).toBe('0x4b701fedb61456cd75df8ae6348f73aa9f529f2363f9ce76398f14aba15f01d6');
  });

  test('demo_ping codeHash from u8a', () => {
    expect(generateCodeHash(Uint8Array.from(pingCode))).toBe(
      '0x4b701fedb61456cd75df8ae6348f73aa9f529f2363f9ce76398f14aba15f01d6',
    );
  });

  test('demo_ping codeHash from hex', () => {
    expect(generateCodeHash(u8aToHex(Uint8Array.from(pingCode)))).toBe(
      '0x4b701fedb61456cd75df8ae6348f73aa9f529f2363f9ce76398f14aba15f01d6',
    );
  });

  test('demo_ping programId', () => {
    expect(generateProgramId(pingCode, '1234')).toBe(
      '0x20b5c1306227dd23c184c98634d440ab50108af0793b5c5b5b1affd0e3487ab0',
    );
  });

  test('programId using codeId', () => {
    expect(generateProgramId(codeId, '1234')).toBe(
      '0x20b5c1306227dd23c184c98634d440ab50108af0793b5c5b5b1affd0e3487ab0',
    );
  });
});
