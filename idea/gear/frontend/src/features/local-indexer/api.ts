import { HexString, ProgramMetadata } from '@gear-js/api';
import localForage from 'localforage';

import { IMeta } from '@/entities/metadata';
import { isState } from '@/features/metadata';

import { METADATA_LOCAL_FORAGE, PROGRAMS_LOCAL_FORAGE } from './consts';
import { DBProgram } from './types';

const getLocalEntity =
  <T>(db: typeof localForage, type: string) =>
  async (id: string) => {
    const result = await db.getItem<T>(id);

    if (!result) throw new Error(`${type} not found`);

    return { result };
  };

const getLocalProgram = getLocalEntity<DBProgram>(PROGRAMS_LOCAL_FORAGE, 'Program');
const getLocalMetadata = getLocalEntity<IMeta>(METADATA_LOCAL_FORAGE, 'Metadata');

const addLocalProgram = (program: DBProgram) => PROGRAMS_LOCAL_FORAGE.setItem(program.id, program);

const addLocalProgramName = async (id: HexString, name: string) => {
  const { result } = await getLocalProgram(id);

  return PROGRAMS_LOCAL_FORAGE.setItem(id, { ...result, name });
};

const changeProgramStateStatus = async (metahash: HexString, metaHex: HexString) => {
  let program: DBProgram | undefined;

  // not an efficient way, probably would be better to get program by index.
  // however, it'd require different library like idb.js
  await PROGRAMS_LOCAL_FORAGE.iterate<DBProgram, unknown>((value) => {
    if (value.metahash !== metahash) return;

    program = value;
  });

  if (!program) return;

  const metadata = ProgramMetadata.from(metaHex);
  const hasState = isState(metadata);

  return PROGRAMS_LOCAL_FORAGE.setItem(program.id, { ...program, hasState });
};

const addLocalMetadata = async (hash: HexString, hex: HexString) =>
  Promise.all([METADATA_LOCAL_FORAGE.setItem(hash, { hex }), changeProgramStateStatus(hash, hex)]);

export { getLocalProgram, getLocalMetadata, addLocalProgram, addLocalProgramName, addLocalMetadata };
