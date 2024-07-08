import { HexString } from '@gear-js/api';
import localForage from 'localforage';

import { IMeta } from '@/entities/metadata';

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

const addLocalMetadata = async (hash: HexString, hex: HexString) => METADATA_LOCAL_FORAGE.setItem(hash, { hex });

export { getLocalProgram, getLocalMetadata, addLocalProgram, addLocalProgramName, addLocalMetadata };
