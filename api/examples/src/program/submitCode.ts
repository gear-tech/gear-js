import { GearApi, GearKeyring } from '@gear-js/api';
import { readFileSync } from 'fs';
import { PATH_TO_OPT } from '../config';

const main = async () => {
  const api = await GearApi.create();

  const alice = await GearKeyring.fromSuri('//Alice');

  const code = readFileSync(PATH_TO_OPT);

  const { codeHash } = api.code.submit(code);

  console.log(`CodeHash: ${codeHash}\n`);

  try {
    return await new Promise((resolve, reject) => {
      api.code.signAndSend(alice, ({ events, status }) => {
        console.log(`STATUS: ${status.toString()}`);
        if (status.isFinalized) resolve(status.asFinalized);
        events.forEach(({ event }) => {
          if (event.method === 'ExtrinsicFailed') {
            reject(api.getExtrinsicFailedError(event).docs.join('/n'));
          } else if (event.method === 'CodeChanged' && status.isInBlock) {
            console.log(JSON.stringify(event.toHuman(), undefined, 2));
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
