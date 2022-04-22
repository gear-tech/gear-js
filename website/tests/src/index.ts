import { GearApi } from '@gear-js/api';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { sendMessages, uploadPrograms } from './prepare';
import { IMessageSpec, IProgramSpec, IPreparedPrograms, IPreparedMessages } from './interfaces';
import { test } from './e2e';
import base from './config/base';
import { expect } from 'chai';

async function processPrepare(api: GearApi): Promise<{
  programs: IPreparedPrograms;
  messages: IPreparedMessages;
}> {
  const programs = load(readFileSync('./spec/programs.yaml', 'utf8')) as { [program: string]: IProgramSpec };
  const uploadedPrograms = await uploadPrograms(api, programs);

  const messages = load(readFileSync('./spec/messages.yaml', 'utf8')) as { [program: string]: IMessageSpec[] };
  const sentMessages = await sendMessages(api, messages, uploadedPrograms);

  return { programs: uploadedPrograms, messages: sentMessages };
}

async function main() {
  const api = await GearApi.create({ providerAddress: base.gear.wsProvider });
  const genesis = api.genesisHash.toHex();
  const prepared = await processPrepare(api);
  console.log(`*** Preparation finished ***`);
  await test(genesis, prepared);
}

// main()
//   .catch((reason) => {
//     console.log(reason);
//     process.exit(1);
//   })
//   .then(() => {
//     process.exit(0);
//   });

expect(14).to.eq(15);
