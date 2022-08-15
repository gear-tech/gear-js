import localForage from 'localforage';

import { GetMetaResponse } from 'types/api';
import { ProgramStatus, ProgramModel, ProgramPaginationModel } from 'types/program';

const localPrograms = localForage.createInstance({
  name: 'programs',
});

export const getLocalProgram = (id: string) =>
  localPrograms.getItem<ProgramModel>(id).then((response) => {
    if (response) {
      return { result: response };
    }

    return Promise.reject(new Error('Program not found'));
  });

export const getLocalProgramMeta = (id: string) =>
  localPrograms.getItem<ProgramModel>(id).then((response) => {
    if (response?.meta) {
      return { result: response.meta as GetMetaResponse };
    }

    return Promise.reject(new Error('Metadata not found'));
  });

export const getLocalPrograms = (params: any) => {
  const result: ProgramPaginationModel = {
    count: 0,
    programs: [],
  };
  const data = { result };

  return localPrograms
    .iterate((elem: ProgramModel, key, iterationNumber) => {
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
    })
    .then(() => {
      data.result.programs.sort((prev, next) => Date.parse(next.timestamp) - Date.parse(prev.timestamp));

      return data;
    });
};

export const uploadLocalProgram = (program: Pick<ProgramModel, 'id' | 'owner' | 'name' | 'title'>) =>
  localPrograms.setItem(program.id, {
    ...program,
    meta: null,
    timestamp: Date(),
    initStatus: ProgramStatus.Success,
  });

export const uploadLocalMetadata = async (programId: string, meta: string, metaBuffer: string, name?: string) => {
  const { result } = await getLocalProgram(programId);

  return localPrograms.setItem(programId, {
    ...result,
    name: name ?? result.name,
    meta: {
      meta,
      program: programId,
      metaFile: metaBuffer,
    },
  });
};
