import { useApi } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';

import { useProgramStatus } from '@/features/program';

import { PROGRAMS_LOCAL_FORAGE } from '../consts';
import { DBProgram } from '../types';

function useLocalProgram() {
  const { api, isApiReady } = useApi();
  const { getProgramStatus } = useProgramStatus();

  // TODO: useMetadataHash hook or util?
  const getMetadataHash = async (id: HexString) => {
    if (!isApiReady) throw new Error('API is not initialized');

    try {
      return await api.code.metaHash(id);
    } catch {
      return null;
    }
  };

  const getCodeId = async (id: HexString) => {
    if (!isApiReady) throw new Error('API is not initialized');

    // cuz error on terminated program
    try {
      return await api.program.codeHash(id);
    } catch {
      return null;
    }
  };

  const getChainProgram = async (id: HexString) => {
    if (!isApiReady) return Promise.reject(new Error('API is not initialized'));

    const name = id;
    const status = await getProgramStatus(id);
    const codeId = await getCodeId(id);
    const metahash = await getMetadataHash(id);

    return { id, name, status, codeId, metahash };
  };

  const getLocalProgram = async (id: HexString) => {
    if (!isApiReady) return Promise.reject(new Error('API is not initialized'));

    const localForageProgram = await PROGRAMS_LOCAL_FORAGE.getItem<DBProgram>(id);

    const isProgramInChain = id === localForageProgram?.id;
    const isProgramFromChain = api.genesisHash.toHex() === localForageProgram?.genesis;

    return isProgramInChain && isProgramFromChain ? localForageProgram : getChainProgram(id);
  };

  const getLocalProgramRequest = async (id: HexString) => ({ result: await getLocalProgram(id) });

  return { getLocalProgram, getLocalProgramRequest };
}

export { useLocalProgram };
