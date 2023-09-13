import { useApi } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';

import { PROGRAMS_LOCAL_FORAGE } from 'api';
import { IProgram } from 'features/program';
import { FetchProgramsParams } from 'api/program';

function useGetLocalPrograms() {
  const { api } = useApi();
  const genesis = api?.genesisHash.toHex();

  const getIndexedAndChainPrograms = (ids: HexString[]) =>
    ids.map(async (id) => {
      const localForageProgram = await PROGRAMS_LOCAL_FORAGE.getItem<IProgram>(id);

      const isProgramInChain = id === localForageProgram?.id;
      const isProgramFromChain = genesis === localForageProgram?.genesis;

      // status = api.query.gearProgram.programStorage(id)

      return isProgramInChain && isProgramFromChain ? localForageProgram : { id, name: id };
    });

  const getFilteredPrograms = (programs: (IProgram | Pick<IProgram, 'id' | 'name'>)[], params: FetchProgramsParams) => {
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

  const getSortedPrograms = (programs: (IProgram | Pick<IProgram, 'id' | 'name'>)[]) =>
    programs.sort((program, nextProgram) =>
      'timestamp' in program && 'timestamp' in nextProgram
        ? Date.parse(nextProgram.timestamp) - Date.parse(program.timestamp)
        : 0,
    );

  const getLocalPrograms = (params: FetchProgramsParams) =>
    api.program
      .allUploadedPrograms()
      .then((ids) => getIndexedAndChainPrograms(ids))
      .then((result) => Promise.all(result))
      .then((result) => getFilteredPrograms(result, params))
      .then((result) => getSortedPrograms(result))
      .then((programs) => ({ result: { programs, count: programs.length } }));

  return getLocalPrograms;
}

export { useGetLocalPrograms };
