import { GearApi, GearKeyring, getWasmMetadata } from '@gear-js/api';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export const uploadProgram = async (api: GearApi, pathToProgram: string, pathToMeta?: string, initPayload?: any) => {
  const alice = await GearKeyring.fromSuri('//Alice');
  const code = readFileSync(pathToProgram);
  const metaFile = pathToMeta ? readFileSync(pathToMeta) : undefined;
  const meta = metaFile ? await getWasmMetadata(metaFile) : undefined;

  const programId = api.program.submit({ code, initPayload, gasLimit: 1_000_000_000 }, meta);
  await api.program.signAndSend(alice, ({ events = [], status }) => {
    console.log(status);
    events.forEach(({ phase, event: { method, section, data }, topics }) => {
      console.log(data[0]['messageId'].toHuman());
    });
  });
  return programId;
};

const main = async () => {
  uploadProgram(await GearApi.create(), resolve('test/wasm/demo_ping.opt.wasm'));
};

main();
