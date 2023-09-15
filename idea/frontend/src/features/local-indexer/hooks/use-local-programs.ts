import { useApi } from '@gear-js/react-hooks';

import { IProgram } from 'features/program';
import { FetchProgramsParams } from 'api/program';

import { LocalProgram } from '../types';
import { useLocalProgram } from './use-local-program';

function useLocalPrograms() {
  const { api } = useApi();
  const { getLocalProgram } = useLocalProgram();

  const getFilteredPrograms = (programs: (IProgram | LocalProgram)[], params: FetchProgramsParams) => {
    const { query, owner, status } = params;

    return programs.filter((program) => {
      const { id, name } = program;

      if (
        (!query || id.includes(query) || name.includes(query)) &&
        (!owner || ('owner' in program && program.owner === owner)) &&
        (!status || ('status' in program && status.includes(program.status)))
      )
        return true;

      return false;
    });
  };

  const getSortedPrograms = (programs: (IProgram | LocalProgram)[]) =>
    programs.sort(
      (program, nextProgram) => Date.parse(nextProgram.timestamp || '0') - Date.parse(program.timestamp || '0'),
    );

  const getLocalPrograms = (params: FetchProgramsParams) =>
    api.program
      .allUploadedPrograms()
      .then((ids) => ids.map((id) => getLocalProgram(id)))
      .then((result) => Promise.all(result))
      .then((result) => getFilteredPrograms(result, params))
      .then((result) => getSortedPrograms(result))
      .then((programs) => ({ result: { programs, count: programs.length } }));

  return { getLocalPrograms };
}

export { useLocalPrograms };
