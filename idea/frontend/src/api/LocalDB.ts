import { Hex, getProgramMetadata } from '@gear-js/api';
import localForage from 'localforage';

import { ProgramStatus, IProgram } from 'entities/program';

import { LocalStorage } from 'shared/config';
import { ProgramPaginationModel } from './program';

const PROGRAMS_LOCAL_FORAGE = localForage.createInstance({ name: 'programs' });

const getLocalProgram = (id: string) =>
  PROGRAMS_LOCAL_FORAGE.getItem<IProgram>(id).then((response) => {
    if (response) {
      return { result: response };
    }

    return Promise.reject(new Error('Program not found'));
  });

const getLocalProgramMeta = (id: string) =>
  PROGRAMS_LOCAL_FORAGE.getItem<IProgram>(id).then((response) => {
    if (response?.meta) {
      return { result: response.meta };
    }

    return Promise.reject(new Error('Metadata not found'));
  });

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

const uploadLocalProgram = (program: Pick<IProgram, 'id' | 'owner' | 'name'>) =>
  PROGRAMS_LOCAL_FORAGE.setItem(program.id, {
    ...program,
    meta: null,
    timestamp: Date(),
    status: ProgramStatus.Active,
  });

const uploadLocalMetadata = async (programId: string, metaHex: Hex, name?: string) => {
  const { result } = await getLocalProgram(programId);

  return PROGRAMS_LOCAL_FORAGE.setItem(programId, {
    ...result,
    name: name ?? result.name,
    meta: getProgramMetadata(metaHex),
    genesis: localStorage.getItem(LocalStorage.Genesis),
  });
};

export {
  getLocalProgram,
  getLocalPrograms,
  getLocalProgramMeta,
  uploadLocalProgram,
  uploadLocalMetadata,
  PROGRAMS_LOCAL_FORAGE,
};
