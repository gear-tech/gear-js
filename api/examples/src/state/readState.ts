import { readFileSync } from 'fs';

import { GearApi, Hex } from '../../../lib';
import { PATH_TO_META } from '../config';

const [programId] = process.argv.slice(2) as [Hex];

const main = async () => {
  const api = await GearApi.create();

  const metaFile = readFileSync(PATH_TO_META);

  const payload = 'AllParticipants';

  const state = await api.programState.read(programId, metaFile, payload);

  console.log(JSON.stringify(state.toHuman(), undefined, 2));
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
