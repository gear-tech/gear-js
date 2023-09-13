import { useApi } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { Option } from '@polkadot/types';
import { IProgram as StorageProgram } from '@gear-js/api';

import { PROGRAMS_LOCAL_FORAGE } from 'api';
import { IProgram, ProgramStatus } from 'features/program';
import { FetchProgramsParams } from 'api/program';

import { LocalProgram } from '../types';

function useGetLocalPrograms() {
  const { api } = useApi();
  const genesis = api?.genesisHash.toHex();

  const getProgramStatus = async (id: HexString) => {
    const option = (await api.query.gearProgram.programStorage(id)) as Option<StorageProgram>;

    const program = option.unwrap();
    const { isTerminated, isExited } = program;

    if (isTerminated) return ProgramStatus.Terminated;
    if (isExited) return ProgramStatus.Exited;

    return ProgramStatus.Active;
  };

  const getIndexedAndChainPrograms = (ids: HexString[]) =>
    ids.map(async (id) => {
      const localForageProgram = await PROGRAMS_LOCAL_FORAGE.getItem<IProgram>(id);

      const isProgramInChain = id === localForageProgram?.id;
      const isProgramFromChain = genesis === localForageProgram?.genesis;

      return isProgramInChain && isProgramFromChain
        ? localForageProgram
        : { id, name: id, status: await getProgramStatus(id) };
    });

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
