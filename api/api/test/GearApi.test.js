const { readFileSync, readdirSync } = require('fs');
const { join } = require('path');
const yaml = require('js-yaml');
const { GearApi, GearKeyring, getWasmMetadata } = require('../lib');

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
   * @type {{title: string, programs: {name: string, id: number, gasLimit: number, value: number, account: string, meta: boolean, initPayload: any}[], messages: {program: number, payload: any, gasLimit: number, value: number, log: string}[]}}
   */
  const testFile = yaml.load(readFileSync(join('./test/spec/programs', filePath), 'utf8'));

  describe(testFile.title, () => {
    test('Upload programs', async () => {
      await api.isReady;
      for (let program of testFile.programs) {
        const code = readFileSync(join(process.env.EXAMPLES_DIR, `${program.name}.opt.wasm`));
        const meta = program.meta
          ? await getWasmMetadata(readFileSync(join(process.env.EXAMPLES_DIR, `${program.name}.meta.wasm`)))
          : {};
        programs.set(program.id, {
          id: api.program.submit(
            { code, initPayload: program.initPayload, gasLimit: program.gasLimit, value: program.value },
            meta,
          ),
          meta,
        });
        let unsub;
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
        expect(0).toBe(await api.program.signAndSend(await accounts[program.account], () => {}));
        const res = await status;
        unsub();
        expect('success').toBe(res);
      }
      return;
    });

    testif(testFile.messages)('Sending messages', async () => {
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
        expect(0).toBe(
          await api.message.signAndSend(await accounts[message.account], (data) => {
            messageId = data.messageId;
          }),
        );
        if (message.log) {
          const logPayload = await log;
          unsub();
          expect(logPayload).toBe(message.log);
        }
      }
    });
  });
  programs.clear();
}

test.todo('read state');
test.todo('read mailbox');
test.todo('reply message');
