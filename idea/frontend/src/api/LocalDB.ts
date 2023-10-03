import { HexString } from '@polkadot/util/types';
import localForage from 'localforage';

import { IProgram } from 'features/program';
import { LocalStorage } from 'shared/config';
import { IMeta } from 'entities/metadata';

const PROGRAMS_LOCAL_FORAGE = localForage.createInstance({ name: 'programs' });
const METADATA_LOCAL_FORAGE = localForage.createInstance({ name: 'metadata' });

const getLocalProgram = (id: string) =>
  PROGRAMS_LOCAL_FORAGE.getItem<IProgram>(id).then((response) =>
    response ? { result: response } : Promise.reject(new Error('Program not found')),
  );

const getLocalMetadata = ({ hash }: { hash: HexString }) =>
  METADATA_LOCAL_FORAGE.getItem<IMeta>(hash).then((response) =>
    response?.hex ? { result: response } : Promise.reject(new Error('Metadata not found')),
  );

const uploadLocalProgram = (
  program: Pick<IProgram, 'id' | 'owner' | 'name' | 'hasState' | 'metahash' | 'status' | 'blockHash'> & {
    code: { id: HexString };
  },
) =>
  PROGRAMS_LOCAL_FORAGE.setItem(program.id, {
    ...program,
    timestamp: Date(),
    genesis: localStorage.getItem(LocalStorage.Genesis),
  });

const uploadLocalMetadata = async (hash: HexString, hex: HexString, programId: HexString, name?: string) =>
  Promise.all([
    METADATA_LOCAL_FORAGE.setItem(hash, { hex }),
    getLocalProgram(programId)
      .then(({ result }) => ({ ...result, name: name ?? result.name }))
      .then((result) => PROGRAMS_LOCAL_FORAGE.setItem(programId, result)),
  ]);

export { getLocalMetadata, uploadLocalProgram, uploadLocalMetadata, PROGRAMS_LOCAL_FORAGE };
