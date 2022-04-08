const { readFileSync, readdirSync } = require('fs');
const { join } = require('path');
const yaml = require('js-yaml');
const { sendTransaction } = require('./utilsFunctions.js');
const { GearApi, GearKeyring } = require('../lib');
const { TEST_WASM_DIR } = require('./config.js');

const submitCodeTestFiles = readdirSync('test/spec/submit_code');
const api = new GearApi();
const accounts = {
  alice: undefined,
  bob: undefined,
};

jest.setTimeout(15000);

beforeAll(async () => {
  await api.isReady;
  accounts.alice = await GearKeyring.fromSuri('//Alice');
  accounts.bob = await GearKeyring.fromSuri('//Bob');
});

afterAll(async () => {
  await api.disconnect();
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
});

for (let filePath of submitCodeTestFiles) {
  const testFile = yaml.load(readFileSync(join('./test/spec/submit_code', filePath), 'utf8'));
  if (testFile.skip) {
    continue;
  }
  describe(testFile.title, () => {
    test('Submit code', async () => {
      for (let program of testFile.programs) {
        const code = readFileSync(join(TEST_WASM_DIR, `${program.name}.opt.wasm`));
        const codeHash = api.code.submit(code);
        expect(codeHash).toBeDefined();

        const transactionData = await sendTransaction(api.code, accounts[program.account], 'CodeSaved');

        expect(transactionData).toBe(codeHash);
      }
      return;
    });
  });
}
