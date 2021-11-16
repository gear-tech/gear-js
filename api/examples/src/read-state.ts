import { CreateType, GearApi, GearKeyring, getWasmMetadata } from '@gear-js/api';
import { uploadProgram } from './upload-program';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const main = async () => {
  const api = await GearApi.create();
  const alice = GearKeyring.fromSuri('//Alice');
  const meta = await getWasmMetadata(readFileSync(process.env.READ_STATE_META_PATH));
  console.log(meta);
  const programId = await uploadProgram(api, process.env.READ_STATE_PROGRAM_PATH, process.env.READ_STATE_META_PATH);
  const result = await api.programState.read(
    programId,
    readFileSync(process.env.READ_STATE_META_PATH),
    CreateType.encode(meta.meta_state_input, 1, meta).toU8a().buffer,
  );
  console.log(result);
};

main().then(() => {
  process.exit(0);
});
