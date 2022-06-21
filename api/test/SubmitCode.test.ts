import { readFileSync } from 'fs';
import { join } from 'path';
import { getAccount, sendTransaction, sleep } from './utilsFunctions';
import { GearApi } from '../lib';
import { GEAR_EXAMPLES_WASM_DIR } from './config';

const api = new GearApi();
const accounts = {};

beforeAll(async () => {
  await api.isReady;
  [accounts['alice']] = await getAccount();
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('Submit code', () => {
  test('demo_sum', async () => {
    const code = readFileSync(join(GEAR_EXAMPLES_WASM_DIR, `demo_sum.opt.wasm`));
    const { codeHash } = api.code.submit(code);
    expect(codeHash).toBeDefined();

    const transactionData = await sendTransaction(api.code, accounts['alice'], 'CodeChanged');
    expect(transactionData.id).toBe(codeHash);
    expect(transactionData.change).toHaveProperty('Active');
    expect(transactionData.change.Active).toHaveProperty('expiration');
  });
});
