import { useEffect, useState, useMemo } from 'react';
import { getProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';

import { fetchProgram, getLocalProgram } from 'api';
import { IProgram } from 'entities/program';

import { HexString } from '@polkadot/util/types';
import { useChain } from './context';

const useProgram = (id?: string, initLoading = false) => {
  const alert = useAlert();

  const { isDevChain } = useChain();
  const getProgram = isDevChain ? getLocalProgram : fetchProgram;

  const [program, setProgram] = useState<IProgram>();
  const [isLoading, setIsLoading] = useState(initLoading);

  const metadata = useMemo(() => {
    const { hex } = program?.meta || {};

    if (hex) return getProgramMetadata(hex);
  }, [program]);

  const updateMeta = (metaHex: HexString) =>
    setProgram((prevProgram) => {
      const { meta } = prevProgram || {};

      if (!prevProgram || !meta) return;

      return { ...prevProgram, meta: { ...meta, hex: metaHex } };
    });

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

  return { program, metadata, isLoading, updateMeta };
};

export { useProgram };
