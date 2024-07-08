import { HexString } from '@polkadot/util/types';
import localForage from 'localforage';

import { LocalStorage } from '@/shared/config';
import { IMeta } from '@/entities/metadata';
import { LocalProgram } from '@/features/local-indexer';

const PROGRAMS_LOCAL_FORAGE = localForage.createInstance({ name: 'programs' });
const METADATA_LOCAL_FORAGE = localForage.createInstance({ name: 'metadata' });

const getLocalEntity =
  <T>(db: typeof localForage, type: string) =>
  async (id: string) => {
    const result = await db.getItem<T>(id);

    if (!result) throw new Error(`${type} not found`);

    return { result };
  };

const getLocalProgram = getLocalEntity<LocalProgram>(PROGRAMS_LOCAL_FORAGE, 'Program');
const getLocalMetadata = getLocalEntity<IMeta>(METADATA_LOCAL_FORAGE, 'Metadata');

const uploadLocalProgram = (program: LocalProgram) => {
  const timestamp = Date();
  const genesis = localStorage.getItem(LocalStorage.Genesis);

  return PROGRAMS_LOCAL_FORAGE.setItem(program.id, { ...program, timestamp, genesis });
};

const addLocalProgramName = async (id: HexString, name: string) => {
  const { result } = await getLocalProgram(id);

  return PROGRAMS_LOCAL_FORAGE.setItem(id, { ...result, name });
};

const uploadLocalMetadata = async (hash: HexString, hex: HexString) => METADATA_LOCAL_FORAGE.setItem(hash, { hex });

export {
  getLocalProgram,
  getLocalMetadata,
  uploadLocalProgram,
  addLocalProgramName,
  uploadLocalMetadata,
  PROGRAMS_LOCAL_FORAGE,
};
