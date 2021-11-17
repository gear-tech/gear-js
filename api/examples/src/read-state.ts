import { GearApi } from '@gear-js/api';
import { uploadProgram } from './upload-program';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from './config';

export const readState = async () => {
  const api = await GearApi.create();
  const metaWasm = readFileSync(join(config.examplesDir, 'demo_meta.meta.wasm'));
  const programId = await uploadProgram(
    api,
    join(config.examplesDir, 'demo_meta.opt.wasm'),
    join(config.examplesDir, 'demo_meta.meta.wasm'),
  );
  const state = await api.programState.read(programId, metaWasm, { decimal: 1, hex: [1] });
  console.log(state.toHuman());
};
