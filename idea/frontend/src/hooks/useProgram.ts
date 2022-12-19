import { useEffect, useState, useMemo } from 'react';
import { ProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';

import { fetchProgram, getLocalProgram } from 'api';
import { IProgram } from 'entities/program';

import { useChain } from './context';

const useProgram = (id?: string, initLoading = false) => {
  const alert = useAlert();

  const { isDevChain } = useChain();
  const getProgram = isDevChain ? getLocalProgram : fetchProgram;

  const [program, setProgram] = useState<IProgram>();
  const [isLoading, setIsLoading] = useState(initLoading);

  const metadata = useMemo(() => {
    const meta = program?.meta?.meta;

    if (meta) return JSON.parse(meta) as ProgramMetadata;
  }, [program]);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getProgram(id)
        .then(({ result }) => setProgram(result))
        .catch((err) => alert.error(err.message))
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { program, metadata, isLoading };
};

export { useProgram };
