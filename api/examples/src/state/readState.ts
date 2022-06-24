import { GearApi, GearKeyring, getWasmMetadata } from '@gear-js/api';
import { readFileSync } from 'fs';
import { PATH_TO_META } from '../config';

const [programId] = process.argv.slice(2);

const main = async () => {
  const api = await GearApi.create();

  const metaFile = readFileSync(PATH_TO_META);

  const payload = {
    decimal: 1,
    hex: [1],
  };

  const state = await api.programState.read(programId, metaFile, payload);

  console.log(state.toHuman());
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
