import { useApi } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { ProgramMetadata } from '@gear-js/api';

import { useProgramStatus } from '@/features/program';
import { isState, useMetadata } from '@/features/metadata';

import { PROGRAMS_LOCAL_FORAGE } from '../consts';
import { LocalProgram } from '../types';

function useLocalProgram() {
  const { api, isApiReady } = useApi();

  const { getMetadata } = useMetadata();
  const { getProgramStatus } = useProgramStatus();

  const getChainProgram = async (id: HexString) => {
    if (!isApiReady) return Promise.reject(new Error('API is not initialized'));

    const name = id;
    const status = await getProgramStatus(id);

    let codeId: HexString | null;
    let metahash: HexString | null;
    let metaHex: HexString | null | undefined;

    // cuz error on terminated program
    try {
      codeId = await api.program.codeHash(id);
    } catch {
      codeId = null;
    }

    try {
      metahash = await api.code.metaHash(codeId || id);
    } catch {
      metahash = null;
    }

    // metadata is retrived via useMetadata, so no need to log errors here
    try {
      metaHex = metahash ? (await getMetadata(metahash)).result.hex : undefined;
    } catch {
      metaHex = null;
    }

    // TODO: on Programs page each program can make a request to backend,
    // is there a way to optimize it?
    const metadata = metaHex ? ProgramMetadata.from(metaHex) : undefined;
    const hasState = isState(metadata);

    return { id, name, status, codeId, metahash, hasState };
  };

  const getLocalProgram = async (id: HexString) => {
    if (!isApiReady) return Promise.reject(new Error('API is not initialized'));

    const localForageProgram = await PROGRAMS_LOCAL_FORAGE.getItem<LocalProgram>(id);

    const isProgramInChain = id === localForageProgram?.id;
    const isProgramFromChain = api.genesisHash.toHex() === localForageProgram?.genesis;

    return isProgramInChain && isProgramFromChain ? localForageProgram : getChainProgram(id);
  };

  const getLocalProgramRequest = async (id: HexString) => ({ result: await getLocalProgram(id) });

  return { getLocalProgram, getLocalProgramRequest };
}

export { useLocalProgram };
