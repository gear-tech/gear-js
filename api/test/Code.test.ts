import { HexString } from '@polkadot/util/types';
import { join } from 'path';
import { readFileSync } from 'fs';

import { TARGET } from './config';
import { getAccount, sendTransaction, sleep } from './utilsFunctions';
import { getApi } from './common';

const api = getApi();
const accounts = {};
const code = readFileSync(join(TARGET, 'test.opt.wasm'));
let codeId: HexString;

beforeAll(async () => {
  await api.isReadyOrError;
  accounts['alice'] = await getAccount('//Alice');
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('Upload code', () => {
  test('demo_sum', async () => {
    const { codeHash } = await api.code.upload(code);
    expect(codeHash).toBeDefined();
    codeId = codeHash;
    const [txData] = await sendTransaction(api.code, accounts['alice'], ['CodeChanged']);
    expect(txData.id.toHex()).toBe(codeHash);
    expect(txData.change.isActive).toBeTruthy();
    expect(txData.change.asActive).toHaveProperty('expiration');
  });

  test('Throw error when code exists', async () => {
    await expect(api.code.upload(code)).rejects.toThrow('Code already exists');
  });
});

describe('All uploaded codes', () => {
  test('get all code ids', async () => {
    expect(codeId).not.toBeUndefined();

    const codeIds = await api.code.all();

    expect(codeIds.includes(codeId)).toBeTruthy();
  });
});
