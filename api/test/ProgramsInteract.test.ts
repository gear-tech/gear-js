import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';
import { CreateType, GearApi, GearKeyring, getWasmMetadata } from '../src';
import { checkLog, checkInit, sendTransaction, getAccount, sleep, describeif, testif } from './utilsFunctions';
import { GEAR_EXAMPLES_WASM_DIR } from './config';

const programs = new Map();
const messages = new Map();
const api = new GearApi();
const accounts = {
  alice: undefined,
  bob: undefined,
};

let testFiles: {
  title: string;
  skip: boolean;
  program: {
    name: string;
    id: number;
    gasLimit: number;
    value: number;
    salt: `0x${string}`;
    account: string;
    meta: boolean;
    initPayload: any;
    log: boolean;
    asU8a: boolean;
  };
  messages: {
    id: number;
    program: number;
    account: string;
    payload: any;
    gasLimit: number;
    asHex: boolean;
    value: number;
    log: string;
  }[];
  mailbox: { message: number; claim: boolean; account: string }[];
}[] = readdirSync('test/spec/programs').map((filePath: string) =>
  yaml.load(readFileSync(join('./test/spec/programs', filePath), 'utf8')),
);
jest.setTimeout(15000);

beforeAll(async () => {
  await api.isReady;
  [accounts.alice, accounts.bob] = await getAccount();
});

afterAll(async () => {
  await api.disconnect();
  await sleep(2000);
});

describe('Upload program', () => {
  for (let testFile of testFiles) {
    testif(!testFile.skip)(testFile.title, async () => {
      const program = testFile.program;
      const code = readFileSync(join(GEAR_EXAMPLES_WASM_DIR, `${program.name}.opt.wasm`));
      const metaFile = readFileSync(join(GEAR_EXAMPLES_WASM_DIR, `${program.name}.meta.wasm`));
      const meta = program.meta ? await getWasmMetadata(metaFile) : {};
      const { programId, salt } = api.program.submit(
        {
          code: program.asU8a ? new Uint8Array(code) : code,
          initPayload: program.initPayload,
          salt: program.salt || undefined,
          gasLimit: program.gasLimit,
          value: program.value,
        },
        meta,
      );
      expect(programId).toBeDefined();
      expect(salt).toBeDefined();
      programs.set(`${testFile.title}.${program.id}`, {
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
      const status = checkInit(api, programs.get(`${testFile.title}.${program.id}`).id);
      const transactionData = await sendTransaction(api.program, accounts[program.account], 'InitMessageEnqueued');
      messageId = transactionData.messageId;

      expect(transactionData.programId).toBe(programs.get(`${testFile.title}.${program.id}`).id);

      expect(await status).toBe('success');
      if (program.log) {
        expect(await log).toBe(program.log);
      }
      unsubs.forEach(async (unsub) => {
        (await unsub)();
      });
      return;
    });
  }
});

describe('Send Message', () => {
  for (let testFile of testFiles) {
    if (!testFile.messages) continue;

    describeif(!testFile.skip)(testFile.title, () => {
      for (let message of testFile.messages) {
        test(message.id.toString(), async () => {
          let payload = message.payload;
          const program = programs.get(`${testFile.title}.${message.program}`);
          const meta = program.meta;
          if (message.asHex) {
            payload = CreateType.create(meta.handle_input, payload, meta).toHex();
          }

          api.message.submit(
            {
              destination: program.id,
              payload,
              gasLimit: message.gasLimit,
              value: message.value,
            },
            !message.asHex ? program.meta : undefined,
          );
          let messageId, log, unsub;
          if (message.log) {
            log = new Promise((resolve) => {
              unsub = api.gearEvents.subscribeToLogEvents((event) => {
                const found = checkLog(event, program.id, messageId);
                if (found === 0) {
                  messages.set(`${testFile.title}.${message.id}`, {
                    logId: event.data.id.toHex(),
                    source: event.data.source.toHex(),
                  });
                  resolve({ payload: event.data.payload.toHex(), withError: false });
                } else if (found === 1) {
                  resolve({ withError: true });
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
            const logResult = await log;
            expect(logResult.withError).toBeFalsy();
            expect(logResult.payload).toBe(message.log);
            (await unsub)();
          }
        });
      }
    });
  }
});

describe('Read Mailbox', () => {
  for (let testFile of testFiles) {
    if (!testFile.mailbox) continue;
    testif(!testFile.skip)(testFile.title, async () => {
      for (let options of testFile.mailbox) {
        const { message, claim, account } = options;
        const messageId = messages.get(`${testFile.title}.${message}`).logId;
        let mailbox = await api.mailbox.read(GearKeyring.decodeAddress(accounts[account].address));
        expect(mailbox.filter((value) => value[0][1] === messageId).length).not.toBe(0);
        if (claim) {
          const submitted = api.claimValueFromMailbox.submit(messageId);
          const transactionData = await sendTransaction(submitted, accounts[account], 'ClaimedValueFromMailbox');
          expect(transactionData).toBe(messageId);
          mailbox = await api.mailbox.read(GearKeyring.decodeAddress(accounts[account].address));
          expect(mailbox.filter((value) => value[0][1] === messageId).length).toBe(0);
        }
      }
    });
  }
});
