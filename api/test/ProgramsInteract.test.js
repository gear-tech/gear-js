const { readFileSync, readdirSync } = require('fs');
const { join } = require('path');
const yaml = require('js-yaml');
const { CreateType, GearApi, GearKeyring, getWasmMetadata } = require('../lib');
const { checkLog, checkInit, sendTransaction } = require('./utilsFunctions.js');

const EXAMPLES_DIR = 'test/wasm';
const programs = new Map();
const messages = new Map();
const testFiles = readdirSync('test/spec/programs');
const api = new GearApi();
const accounts = {
  alice: undefined,
  bob: undefined,
};
const testif = (condition) => (condition ? test : test.skip);

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

for (let filePath of testFiles) {
  /**
   * @type {{title: string, programs: {name: string, id: number, gasLimit: number, value: number, salt: string, account: string, meta: boolean, initPayload: any}[], messages: {id: number, program: number, payload: any, gasLimit: number, value: number, log: string}[], gasSpent: number[]}}
   */
  const testFile = yaml.load(readFileSync(join('./test/spec/programs', filePath), 'utf8'));
  if (testFile.skip) {
    continue;
  }
  describe(testFile.title, () => {
    test('Upload programs', async () => {
      for (let program of testFile.programs) {
        const code = readFileSync(join(EXAMPLES_DIR, `${program.name}.opt.wasm`));
        const metaFile = readFileSync(join(EXAMPLES_DIR, `${program.name}.meta.wasm`));
        const meta = program.meta ? await getWasmMetadata(metaFile) : {};
        const { programId, salt } = api.program.submit(
          {
            code,
            initPayload: program.initPayload,
            salt: program.salt || undefined,
            gasLimit: program.gasLimit,
            value: program.value,
          },
          meta,
        );
        expect(programId).toBeDefined();
        expect(salt).toBeDefined();
        programs.set(program.id, {
          id: programId,
          meta,
          metaFile,
        });
        let log, messageId;
        const unsubs = [];

        if (program.log) {
          log = new Promise((resolve) => {
            unsubs.push(
              api.gearEvents.subscribeToLogEvents((event) => {
                if (checkLog(event, programId, messageId)) {
                  resolve(event.data.payload.toHex());
                }
              }),
            );
          });
        }

        // Check program initialization
        const status = checkInit(api, programs.get(program.id).id);
        const transactionData = await sendTransaction(api.program, accounts[program.account], 'InitMessageEnqueued');
        messageId = transactionData.messageId;

        expect(transactionData.programId).toBe(programs.get(program.id).id);

        expect(await status).toBe('success');
        if (program.log) {
          expect(await log).toBe(program.log);
        }
        unsubs.forEach(async (unsub) => {
          (await unsub)();
        });
      }
      return;
    });

    testif(testFile.messages)('Sending messages', async () => {
      for (let message of testFile.messages) {
        let payload = message.payload;
        const meta = programs.get(message.program).meta;
        if (message.asHex) {
          payload = CreateType.create(meta.handle_input, payload, meta).toHex();
        }
        api.message.submit(
          {
            destination: programs.get(message.program).id,
            payload,
            gasLimit: message.gasLimit,
            value: message.value,
          },
          !message.asHex ? programs.get(message.program).meta : undefined,
        );
        let messageId, log, unsub;
        if (message.log) {
          log = new Promise((resolve) => {
            unsub = api.gearEvents.subscribeToLogEvents((event) => {
              if (checkLog(event, programs.get(message.program).id, messageId)) {
                messages.set(message.id, {
                  logId: event.data.id.toHex(),
                  source: event.data.source.toHex(),
                });
                resolve(event.data.payload.toHex());
              }
            });
          });
        }

        const transactionData = await sendTransaction(
          api.message,
          accounts[message.account],
          'DispatchMessageEnqueued',
        );
        messageId = transactionData.messageId;

        expect(transactionData).toBeDefined();

        if (message.log) {
          expect(await log).toBe(message.log);
          (await unsub)();
        }
      }
    });

    testif(testFile.state)('Read state', async () => {
      for (let state of testFile.state) {
        const program = programs.get(state.program);
        const result = await api.programState.read(program.id, program.metaFile, state.payload);
        expect(result.toHex()).toBe(state.result);
      }
    });

    testif(testFile.mailbox)('Mailbox', async () => {
      for (let options of testFile.mailbox) {
        const { message, claim, account } = options;
        const messageId = messages.get(message).logId;
        let mailbox = await api.mailbox.read(GearKeyring.decodeAddress(accounts[account].address));
        expect(mailbox.toHuman()).not.toBe(null);
        expect(Object.keys(mailbox.toHuman()).includes(messageId)).toBe(true);
        if (claim) {
          const submitted = api.claimValueFromMailbox.submit(messageId);
          const transactionData = await sendTransaction(submitted, accounts[account], 'ClaimedValueFromMailbox');
          expect(transactionData).toBe(messageId);
          mailbox = await api.mailbox.read(GearKeyring.decodeAddress(accounts[account].address));
          expect(Object.keys(mailbox.toHuman()).includes(messageId)).toBe(false);
        }
      }
    });
  });
  programs.clear();
}
