import { readFileSync } from 'node:fs';
import { generateCodeHash } from '../src';

const code = Uint8Array.from(readFileSync('./test/wasm/ping.wasm'));
const CODE_HASH = '0x4b701fedb61456cd75df8ae6348f73aa9f529f2363f9ce76398f14aba15f01d6';

describe('hashes', () => {
  test('generate code hash', () => {
    expect(generateCodeHash(code)).toBe(CODE_HASH);
  });

  test('generate code hash from hex code', () => {
    const hexCode = Buffer.from(code).toString('hex');

    expect(generateCodeHash(hexCode)).toBe(CODE_HASH);
  });
});
