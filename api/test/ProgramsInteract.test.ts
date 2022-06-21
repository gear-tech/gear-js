import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';
import { CreateType, GearApi, GearKeyring, getWasmMetadata } from '../src';
import {
  checkInit,
  sendTransaction,
  getAccount,
  sleep,
  describeif,
  testif,
  listenToUserMessageSent,
} from './utilsFunctions';
import { GEAR_EXAMPLES_WASM_DIR } from './config';

const programs = new Map();
const messages = new Map();
const api = new GearApi();
let accounts = {};

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

beforeAll(async () => {
  await api.isReady;
  [accounts['alice'], accounts['bob']] = await getAccount();
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

      // Check program initialization
      const status = checkInit(api, programId);
      const transactionData = await sendTransaction(api.program, accounts[program.account], 'MessageEnqueued');

      expect(transactionData.destination).toBe(programId);

      expect(await status()).toBe('success');
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
          let waitForReply;
          if (message.log) {
            waitForReply = listenToUserMessageSent(api, program.id);
          }

          const transactionData = await sendTransaction(api.message, accounts[message.account], 'MessageEnqueued');
          expect(transactionData).toBeDefined();

          if (message.log) {
            const reply = await waitForReply(transactionData.id);
            messages.set(`${testFile.title}.${message.id}`, {
              logId: reply.message.id.toHex(),
              source: reply.message.source.toHex(),
            });
            expect(reply?.message.reply.unwrap()[1].toNumber()).toBe(0);
            expect(reply?.message.payload.toHex()).toBe(message.log);
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
          const transactionData = await sendTransaction(submitted, accounts[account], 'UserMessageRead');
          expect(transactionData.id).toBe(messageId);
          mailbox = await api.mailbox.read(GearKeyring.decodeAddress(accounts[account].address));
          expect(mailbox.filter((value) => value[0][1] === messageId).length).toBe(0);
        }
      }
    });
  }
});
