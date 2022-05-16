import { useEffect, useState, useMemo } from 'react';
import { useAlert } from 'react-alert';
import { Metadata } from '@gear-js/api';

import { getProgram } from 'services';
import { RPCResponseError } from 'services/ServerRPCRequestService';
import { ProgramModel } from 'types/program';

const useProgram = (id?: string): [ProgramModel?, Metadata?] => {
  const alert = useAlert();

  const [program, setProgram] = useState<ProgramModel>();

  const metadata = useMemo(() => {
    const meta = program?.meta?.meta;

    if (meta) {
      return JSON.parse(meta) as Metadata;
    }
  }, [program]);

  useEffect(() => {
    if (id) {
      getProgram(id).then(({ result }) => setProgram(result)).catch((err: RPCResponseError) => alert.error(err.message));
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return [program, metadata];
};

export { useProgram };
