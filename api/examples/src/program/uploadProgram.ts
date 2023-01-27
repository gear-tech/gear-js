import { readFileSync } from 'fs';

import { GearApi, GearKeyring, getWasmMetadata } from '../../../lib';
import { PATH_TO_META, PATH_TO_OPT } from '../config';
import { decodeAddress } from '../../../lib/utils';
import { waitForInit } from './waitForInit';

const main = async () => {
  const api = await GearApi.create();

  const alice = await GearKeyring.fromSuri('//Alice');

  const code = readFileSync(PATH_TO_OPT);
  const metaFile = readFileSync(PATH_TO_META);

  const meta = await getWasmMetadata(metaFile);

  const initPayload = {
    name_of_event: 'GEAR JS EXAMPLE',
  };

  const gas = await api.program.calculateGas.initUpload(decodeAddress(alice.address), code, initPayload, 0, true, meta);

  const { programId } = api.program.upload({ code, initPayload, gasLimit: gas.min_limit }, meta);

  console.log(`ProgramID: ${programId}\n`);

  waitForInit(api, programId)
    .then(() => console.log('Program initialization was successful'))
    .catch((error) => {
      console.log(`Program initialization failed due to next error: ${error}\n`);
    });

  try {
    return await new Promise((resolve, reject) => {
      api.program.signAndSend(alice, ({ events, status }) => {
        console.log(`STATUS: ${status.toString()}`);
        if (status.isFinalized) resolve(status.asFinalized);
        events.forEach(({ event }) => {
          if (event.method === 'ExtrinsicFailed') {
            reject(api.getExtrinsicFailedError(event).docs.join('/n'));
          }
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
