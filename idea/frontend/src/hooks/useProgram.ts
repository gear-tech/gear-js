import { useAlert } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { useEffect, useState } from 'react';

import { fetchProgram, getLocalProgram } from 'api';
import { IProgram } from 'entities/program';

import { useChain } from './context';

const useProgram = (id: HexString | undefined) => {
  const alert = useAlert();

  const { isDevChain } = useChain();
  const getProgram = isDevChain ? getLocalProgram : fetchProgram;

  const [program, setProgram] = useState<IProgram>();
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
