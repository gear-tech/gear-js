import { useState, useCallback } from 'react';
import { AnyJson } from '@polkadot/types/types';
import { Hex } from '@gear-js/api';
import { useApi, useAlert } from '@gear-js/react-hooks';

const useStateRead = (programId: Hex, metaBuffer: Buffer | undefined) => {
  const alert = useAlert();
  const { api } = useApi();

  const [state, setState] = useState<AnyJson>();
  const [isReaded, setIsReaded] = useState(true);

  const readState = useCallback(
    async (initValue?: AnyJson) => {
      if (metaBuffer) {
        try {
          setIsReaded(false);

          const result = await api.programState.read(programId, metaBuffer, initValue);

          setState(result.toHuman());
        } catch (error) {
          const message = (error as Error).message;

          alert.error(message);
        } finally {
          setIsReaded(true);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, programId, metaBuffer],
  );

  return { readState, state, isReaded };
};

export { useStateRead };
