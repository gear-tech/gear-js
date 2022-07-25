import { useEffect, useState, useMemo } from 'react';
import { Metadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';

import { getProgram } from 'services';
import { RPCResponseError } from 'services/ServerRPCRequestService';
import { ProgramModel } from 'types/program';

const useProgram = (id?: string) => {
  const alert = useAlert();

  const [program, setProgram] = useState<ProgramModel>();
  const [isLoading, setIsLoading] = useState(false);

  const metadata = useMemo(() => {
    const meta = program?.meta?.meta;

    if (meta) {
      return JSON.parse(meta) as Metadata;
    }
  }, [program]);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getProgram(id)
        .then(({ result }) => setProgram(result))
        .catch((err: RPCResponseError) => alert.error(err.message))
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { program, metadata, isLoading };
};

export { useProgram };
