import { HexString } from '@polkadot/util/types';
import { join } from 'path';
import { readFileSync } from 'fs';
import { u8aToHex } from '@polkadot/util';

import { generateCodeHash, generateProgramId } from '../src';
import { TEST_WASM_DIR } from './config';
import { sleep } from './utilsFunctions';
import { getApi } from './common';

const pingCode = readFileSync(join(TEST_WASM_DIR, 'demo_ping.opt.wasm'));
let codeId: HexString;

const api = getApi();

beforeAll(async () => {
  await api.isReadyOrError;
});

afterAll(async () => {
  await api.disconnect();
  await sleep(2000);
});

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

  test('demo_ping codeHash from HexString', () => {
    expect(generateCodeHash(u8aToHex(Uint8Array.from(pingCode)))).toBe(
      '0x4b701fedb61456cd75df8ae6348f73aa9f529f2363f9ce76398f14aba15f01d6',
    );
  });

  test('demo_ping programId', () => {
    expect(generateProgramId(api, pingCode, '1234')).toBe(
      '0x86220eab422209d36e01f443a98564d2c3149e845713e4924e15d55d3b4acd78',
    );
  });

  test('programId using codeId', () => {
    expect(generateProgramId(api, codeId, '1234')).toBe(
      '0x86220eab422209d36e01f443a98564d2c3149e845713e4924e15d55d3b4acd78',
    );
  });
});
