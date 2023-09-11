import { useApi } from '@gear-js/react-hooks';
import { useEffect } from 'react';

import { PROGRAMS_LOCAL_FORAGE } from 'api';
import { IProgram } from 'features/program';

import { useChain } from './context';

function useLocalProgramsFilter() {
  const { api, isApiReady } = useApi();
  const { isDevChain } = useChain();

  const filterLocalPrograms = () => {
    const genesis = api.genesisHash.toHex();

    api.program.allUploadedPrograms().then((chainProgramIDs) =>
      PROGRAMS_LOCAL_FORAGE.iterate((program: IProgram) => {
        const isProgramInChain = chainProgramIDs.includes(program.id);
        const isProgramFromChain = genesis === program.genesis;

        if (!isProgramInChain || !isProgramFromChain) PROGRAMS_LOCAL_FORAGE.removeItem(program.id);
      }),
    );
  };

  useEffect(() => {
    if (isApiReady && isDevChain) filterLocalPrograms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, isDevChain]);
}

export { useLocalProgramsFilter };
