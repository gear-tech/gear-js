import { useApi } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { Option } from '@polkadot/types';
import { IProgram as StorageProgram } from '@gear-js/api';

import { PROGRAMS_LOCAL_FORAGE } from 'api';
import { IProgram, ProgramStatus } from 'features/program';

function useLocalProgram() {
  const { api } = useApi();
  const genesis = api?.genesisHash.toHex();

  const getProgramStatus = async (id: HexString) => {
    const option = (await api.query.gearProgram.programStorage(id)) as Option<StorageProgram>;
    const { isTerminated, isExited } = option.unwrap();

    if (isTerminated) return ProgramStatus.Terminated;
    if (isExited) return ProgramStatus.Exited;

    return ProgramStatus.Active;
  };

  const getChainProgram = async (id: HexString) => {
    const name = id;
    const status = await getProgramStatus(id);

    let codeHash: HexString | null;
    let metahash: HexString | null;

    try {
      // cuz error on terminated program
      codeHash = await api.program.codeHash(id);
    } catch {
      codeHash = null;
    }

    try {
      metahash = await api.code.metaHash(codeHash || id);
    } catch {
      metahash = null;
    }

    const code = codeHash ? { id: codeHash } : undefined;

    return { id, name, status, code, metahash, hasState: true };
  };

  const getLocalProgram = async (id: HexString) => {
    const localForageProgram = await PROGRAMS_LOCAL_FORAGE.getItem<IProgram>(id);

    const isProgramInChain = id === localForageProgram?.id;
    const isProgramFromChain = genesis === localForageProgram?.genesis;

    return isProgramInChain && isProgramFromChain ? localForageProgram : getChainProgram(id);
  };

  const getLocalProgramRequest = async (id: HexString) => ({ result: await getLocalProgram(id) });

  return { getLocalProgram, getLocalProgramRequest };
}

export { useLocalProgram };
