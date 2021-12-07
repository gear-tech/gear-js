const { readFileSync, readdirSync } = require('fs');
const { join } = require('path');
const yaml = require('js-yaml');
const { GearApi, GearKeyring } = require('../lib');

const programs = new Map();
const testFiles = readdirSync('test/spec/programs');
const api = new GearApi();
const accounts = {
  alice: GearKeyring.fromSuri('//Alice'),
  bob: GearKeyring.fromSuri('//Bob'),
};

describe('Upload programs test', () => {
  for (let filePath of testFiles) {
    const testFile = yaml.load(readFileSync(join('./test/spec/programs', filePath), 'utf8'));
    test(
      testFile.title,
      async () => {
        await api.isReady;
        for (let program of testFile.programs) {
          const code = readFileSync(join(process.env.EXAMPLES_DIR, `${program.name}.opt.wasm`));
          const initPayload = program.initPayload;
          const gasLimit = program.gasLimit;
          const value = program.value;
          const metaFile = readFileSync(join(process.env.EXAMPLES_DIR, `${program.name}.meta.wasm`));
          const meta = program.meta ? await getWasmMetadata(metaFile) : {};
          programs.set(program.name, api.program.submit({ code, initPayload, gasLimit, value }, meta));
          let unsub;
          const status = new Promise(async (resolve) => {
            unsub = await api.gearEvents.subscribeProgramEvents((event) => {
              if (event.data.info.programId.toHex() === programs.get(program.name)) {
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
      },
      10000,
    );
  }
});

test.todo('sending message');
test.todo('read state');
test.todo('listen log');
test.todo('read mailbox');
test.todo('reply message');
