import { getProgramMetadata } from '@gear-js/api';
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
  // const [isLoading, setIsLoading] = useState(true);

  const updateMeta = (metaHex: HexString, programName: string) =>
    setProgram((prevProgram) => {
      if (!prevProgram) return;

      const meta = { ...getProgramMetadata(metaHex), hex: metaHex };

      return { ...prevProgram, name: programName, meta };
    });

  useEffect(() => {
    if (!id) return;

    getProgram(id)
      .then(({ result }) => setProgram(result))
      .catch(({ message }: Error) => alert.error(message))
      .finally(() => setIsProgramReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { program, isProgramReady, updateMeta };
};

export { useProgram };
