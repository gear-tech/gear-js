import { HexString } from '@polkadot/util/types';
import localForage from 'localforage';

import { ProgramStatus, IProgram } from 'entities/program';
import { LocalStorage } from 'shared/config';
import { IMeta } from 'entities/metadata';

import { ProgramPaginationModel } from './program';

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

const getLocalPrograms = (params: any) => {
  const result: ProgramPaginationModel = {
    count: 0,
    programs: [],
  };
  const data = { result };

  return PROGRAMS_LOCAL_FORAGE.iterate((elem: IProgram) => {
    if (params.query || params.owner || params.status) {
      if (params.query) {
        if (elem.name?.includes(params.query) || elem.id?.includes(params.query)) {
          data.result.programs.push(elem);
        }
      }

      if (params.owner) {
        if (elem.owner === params.owner) {
          data.result.programs.push(elem);
        }
      }

      if (params.status) {
        if (params.status.includes(elem.status)) {
          data.result.programs.push(elem);
        }
      }
    } else {
      data.result.programs.push(elem);
    }
  }).then(() => {
    data.result.programs.sort((prev, next) => Date.parse(next.timestamp) - Date.parse(prev.timestamp));
    data.result.count = data.result.programs.length;

    return data;
  });
};

const uploadLocalProgram = (
  program: Pick<IProgram, 'id' | 'owner' | 'name' | 'hasState' | 'metahash'> & { code: { id: HexString } },
) =>
  PROGRAMS_LOCAL_FORAGE.setItem(program.id, {
    ...program,
    timestamp: Date(),
    status: ProgramStatus.Active,
    genesis: localStorage.getItem(LocalStorage.Genesis),
  });

const uploadLocalMetadata = async (hash: HexString, hex: HexString, programId: HexString, name?: string) =>
  Promise.all([
    METADATA_LOCAL_FORAGE.setItem(hash, { hex }),
    getLocalProgram(programId)
      .then(({ result }) => ({ ...result, name: name ?? result.name }))
      .then((result) => PROGRAMS_LOCAL_FORAGE.setItem(programId, result)),
  ]);

export {
  getLocalProgram,
  getLocalPrograms,
  getLocalMetadata,
  uploadLocalProgram,
  uploadLocalMetadata,
  PROGRAMS_LOCAL_FORAGE,
};
