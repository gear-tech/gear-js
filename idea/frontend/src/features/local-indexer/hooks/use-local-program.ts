import { ProgramMetadata } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';

import { IMeta } from '@/entities/metadata';
import { isState } from '@/features/metadata';
import { useProgramStatus } from '@/features/program';

import { METADATA_LOCAL_FORAGE, PROGRAMS_LOCAL_FORAGE } from '../consts';
import { DBProgram } from '../types';

function useLocalProgram() {
  const { api, isApiReady } = useApi();
  const { getProgramStatus } = useProgramStatus();

  // TODO: useMetadataHash hook or util?
  const getMetadataHash = async (id: HexString) => {
    if (!isApiReady) throw new Error('API is not initialized');

    try {
      return await api.program.metaHash(id);
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

  // TODO: remove
  const getHasState = async (metahash: HexString | null) => {
    if (!metahash) return false;

    const localForageMetadata = metahash ? await METADATA_LOCAL_FORAGE.getItem<IMeta>(metahash) : undefined;
    const metadata = localForageMetadata?.hex ? ProgramMetadata.from(localForageMetadata.hex) : undefined;

    return isState(metadata);
  };

  const getChainProgram = async (id: HexString) => {
    if (!isApiReady) return Promise.reject(new Error('API is not initialized'));

    const name = id;
    const status = await getProgramStatus(id);
    const codeId = await getCodeId(id);
    const metahash = await getMetadataHash(id);
    const hasState = await getHasState(metahash);

    return { id, name, status, codeId, metahash, hasState };
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
