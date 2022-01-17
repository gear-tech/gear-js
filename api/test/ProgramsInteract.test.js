const { readFileSync, readdirSync } = require('fs');
const { join } = require('path');
const yaml = require('js-yaml');
const { GearApi, GearKeyring, getWasmMetadata } = require('../lib');

const EXAMPLES_DIR = 'test/wasm';
const programs = new Map();
const testFiles = readdirSync('test/spec/programs');
const api = new GearApi();
const accounts = {
  alice: GearKeyring.fromSuri('//Alice'),
  bob: GearKeyring.fromSuri('//Bob'),
};

jest.setTimeout(20000);
const testif = (condition) => (condition ? test : test.skip);

for (let filePath of testFiles) {
  /**
   * @type {{title: string, programs: {name: string, id: number, gasLimit: number, value: number, account: string, meta: boolean, initPayload: any}[], messages: {id: number, program: number, payload: any, gasLimit: number, value: number, log: string}[], gasSpent: number[]}}
   */
  const testFile = yaml.load(readFileSync(join('./test/spec/programs', filePath), 'utf8'));

  describe(testFile.title, () => {
    testif(!testFile.skip)('Upload programs', async () => {
      await api.isReady;
      for (let program of testFile.programs) {
        const code = readFileSync(join(EXAMPLES_DIR, `${program.name}.opt.wasm`));
        const metaFile = readFileSync(join(EXAMPLES_DIR, `${program.name}.meta.wasm`));
        const meta = program.meta ? await getWasmMetadata(metaFile) : {};
        const programId = api.program.submit(
          { code, initPayload: program.initPayload, gasLimit: program.gasLimit, value: program.value },
          meta,
        );
        programs.set(program.id, {
          id: programId,
          meta,
          metaFile,
        });
        let unsub, log, messageId;

        if (program.log) {
          log = new Promise(async (resolve) => {
            unsub = await api.gearEvents.subscribeLogEvents((event) => {
              if (event.data.source.toHex() === programId) {
                if (
                  event.data.reply.unwrap()[1].toNumber() === 0 &&
                  event.data.reply.unwrap()[0].toHex() === messageId
                ) {
                  resolve(event.data.payload.toHex());
                }
              }
            });
          });
        }

        const status = new Promise(async (resolve) => {
          unsub = await api.gearEvents.subscribeProgramEvents((event) => {
            if (event.data.info.programId.toHex() === programs.get(program.id).id) {
              if (api.events.gear.InitSuccess.is(event)) {
                resolve('success');
              } else {
                resolve('failed');
              }
            }
          });
        });
        expect(
          await api.program.signAndSend(await accounts[program.account], (data) => {
            messageId = data.messageId;
          }),
        ).toBe(0);
        const res = await status;
        unsub();
        expect(res).toBe('success');
        if (program.log) {
          const logPayload = await log;
          unsub();
          expect(logPayload).toBe(program.log);
        }
      }
      return;
    });

    testif(!testFile.skip && testFile.messages)('Sending messages', async () => {
      await api.isReady;
      for (let message of testFile.messages) {
        api.message.submit(
          {
            destination: programs.get(message.program).id,
            payload: message.payload,
            gasLimit: message.gasLimit,
            value: message.value,
          },
          programs.get(message.program).meta,
        );
        let messageId, log, unsub;
        if (message.log) {
          log = new Promise(async (resolve) => {
            unsub = await api.gearEvents.subscribeLogEvents((event) => {
              if (event.data.source.toHex() === programs.get(message.program).id) {
                if (
                  event.data.reply.unwrap()[1].toNumber() === 0 &&
                  event.data.reply.unwrap()[0].toHex() === messageId
                ) {
                  resolve(event.data.payload.toHex());
                }
              }
            });
          });
        }
        expect(
          await api.message.signAndSend(await accounts[message.account], (data) => {
            messageId = data.messageId;
          }),
        ).toBe(0);
        if (message.log) {
          const logPayload = await log;
          unsub();
          expect(logPayload).toBe(message.log);
        }
      }
    });

    testif(!testFile.skip && testFile.state)('Read state', async () => {
      await api.isReady;
      for (let state of testFile.state) {
        const program = programs.get(state.program);
        const result = await api.programState.read(program.id, program.metaFile, state.payload);
        expect(result.toHex()).toBe(state.result);
      }
    });

    testif(!testFile.skip && testFile.gasSpent)('Get gas spent', async () => {
      await api.isReady;
      const messages = testFile.gasSpent.map((id) => {
        return testFile.messages.find((message) => message.id === id);
      });
      for (let message of messages) {
        const gasSpent = await api.program.getGasSpent(
          programs.get(message.program).id,
          message.payload,
          programs.get(message.program).meta.handle_input,
          programs.get(message.program).meta,
        );
        expect(gasSpent).toBeDefined();
      }
    });
  });
  programs.clear();
}
