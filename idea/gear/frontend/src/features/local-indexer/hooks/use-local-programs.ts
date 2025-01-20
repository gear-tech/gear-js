import { useApi } from '@gear-js/react-hooks';

import { ProgramsParameters } from '@/features/program';

import { LocalProgram } from '../types';
import { useLocalProgram } from './use-local-program';

function useLocalPrograms() {
  const { api, isApiReady } = useApi();
  const { getLocalProgram } = useLocalProgram();

  const getFilteredPrograms = (programs: LocalProgram[], params: ProgramsParameters) => {
    const { query, owner, status, codeId } = params;

    return programs.filter((program) => {
      const { id, name } = program;

      if (
        (!query || id.includes(query) || (name && name.includes(query))) &&
        (!owner || ('owner' in program && program.owner === owner)) &&
        (!status || status.includes(program.status)) &&
        (!codeId || program.codeId === codeId)
      )
        return true;

      return false;
    });
  };

  const getSortedPrograms = (programs: LocalProgram[]) =>
    programs.sort(
      (program, nextProgram) =>
        Date.parse('timestamp' in nextProgram ? nextProgram.timestamp : '0') -
        Date.parse('timestamp' in program ? program.timestamp : '0'),
    );

  const getLocalPrograms = async (params: ProgramsParameters) => {
    if (!isApiReady) return Promise.reject(new Error('API is not initialized'));

    return api.program
      .allUploadedPrograms()
      .then((ids) => ids.map((id) => getLocalProgram(id)))
      .then((result) => Promise.all(result))
      .then((result) => getFilteredPrograms(result, params))
      .then((result) => getSortedPrograms(result))
      .then((result) => ({ result: { result, count: result.length } }));
  };

  return { getLocalPrograms };
}

export { useLocalPrograms };
