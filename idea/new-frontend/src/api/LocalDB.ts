import localForage from 'localforage';

import { ProgramStatus, IProgram } from 'entities/program';

import { ProgramPaginationModel } from './program';
import { FetchMetadataResponse } from './metadata';

const PROGRAMS_LOCAL_FORAGE = localForage.createInstance({
  name: 'programs',
});

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
      return { result: response.meta as FetchMetadataResponse };
    }

    return Promise.reject(new Error('Metadata not found'));
  });

const getLocalPrograms = (params: any) => {
  const result: ProgramPaginationModel = {
    count: 0,
    programs: [],
  };
  const data = { result };

  return PROGRAMS_LOCAL_FORAGE.iterate((elem: IProgram, key, iterationNumber) => {
    const newLimit = params.offset + params.limit;

    data.result.count = iterationNumber;

    if (params.query) {
      if (
        (elem.name?.includes(params.query) || elem.id?.includes(params.query)) &&
        iterationNumber <= newLimit &&
        iterationNumber > params.offset
      ) {
        data.result.programs.push(elem);
      }
    } else if (iterationNumber <= newLimit && iterationNumber > params.offset) {
      data.result.programs.push(elem);
    }
  }).then(() => {
    data.result.programs.sort((prev, next) => Date.parse(next.timestamp) - Date.parse(prev.timestamp));

    return data;
  });
};

const uploadLocalProgram = (program: Pick<IProgram, 'id' | 'owner' | 'name' | 'title'>) =>
  PROGRAMS_LOCAL_FORAGE.setItem(program.id, {
    ...program,
    meta: null,
    timestamp: Date(),
    initStatus: ProgramStatus.Success,
  });

const uploadLocalMetadata = async (programId: string, meta?: string, metaBuffer?: string, name?: string) => {
  const { result } = await getLocalProgram(programId);

  return PROGRAMS_LOCAL_FORAGE.setItem(programId, {
    ...result,
    name: name ?? result.name,
    meta: {
      meta,
      program: programId,
      metaFile: metaBuffer,
    },
  });
};

export { getLocalProgram, getLocalPrograms, getLocalProgramMeta, uploadLocalProgram, uploadLocalMetadata };
