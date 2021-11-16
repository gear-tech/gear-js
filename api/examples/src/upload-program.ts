import { GearApi, GearKeyring, getWasmMetadata } from '@gear-js/api';
import { readFileSync } from 'fs';

export const uploadProgram = async (api: GearApi, pathToProgram: string, pathToMeta: string, initPayload?: any) => {
  const alice = GearKeyring.fromSuri('//Alice');
  const code = readFileSync(pathToProgram);
  const metaFile = readFileSync(pathToMeta);
  const meta = await getWasmMetadata(metaFile);

  const programId = api.program.submit({ code, initPayload, gasLimit: 100_000_000 }, meta);
  await api.program.signAndSend(alice, (data) => {
    console.log(data);
  });
  return programId;
};
