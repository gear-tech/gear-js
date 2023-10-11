import { useAlert } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { useEffect, useState } from 'react';

import { fetchProgram } from '@/api';
import { IProgram } from '@/features/program';
import { LocalProgram, useLocalProgram } from '@/features/local-indexer';

import { useChain } from './context';

const useProgram = (id: HexString | undefined) => {
  const alert = useAlert();

  const { isDevChain } = useChain();
  const { getLocalProgramRequest } = useLocalProgram();
  const getProgram = isDevChain ? getLocalProgramRequest : fetchProgram;

  const [program, setProgram] = useState<IProgram | LocalProgram>();
  const [isProgramReady, setIsProgramReady] = useState(false);

  const setProgramName = (name: string) => setProgram((prevState) => (prevState ? { ...prevState, name } : prevState));

  useEffect(() => {
    if (!id) return;

    getProgram(id)
      .then(({ result }) => setProgram(result))
      .catch(({ message }: Error) => alert.error(message))
      .finally(() => setIsProgramReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { program, isProgramReady, setProgramName };
};

export { useProgram };
