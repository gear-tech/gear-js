import { HexString } from '@polkadot/util/types';
import { readFileSync } from 'fs';

import { GearApi, getProgramMetadata, getStateMetadata } from '@gear-js/api';
import { PATH_TO_META, PATH_TO_STATE_WASM } from '../config';

const [programId] = process.argv.slice(2) as [HexString];
const metaFile = readFileSync(PATH_TO_META, 'utf-8');

const readFullState = async (api: GearApi) => {
  const meta = getProgramMetadata(`0x${metaFile}`);

  const state = await api.programState.read({ programId }, meta, meta.types.state);

  console.log(JSON.stringify(state.toHuman(), undefined, 2));
};

const readStateUsingWasm = async (api: GearApi) => {
  const stateWasm = readFileSync(PATH_TO_STATE_WASM);
  const meta = await getStateMetadata(stateWasm);

  console.log(
    'Available functions:',
    Object.keys(meta.functions).map((fn) => meta.getTypeDef(meta.functions[fn].input)),
  );

  const state = await api.programState.readUsingWasm(
    { programId, fn_name: 'wallet_by_id', wasm: stateWasm, argument: { decimal: 1, hex: '0x01' } },
    meta,
  );

  console.log(JSON.stringify(state.toHuman(), undefined, 2));
};

const main = async () => {
  const api = await GearApi.create();

  await readFullState(api);

  await readStateUsingWasm(api);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
