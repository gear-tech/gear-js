import { useState, useCallback } from 'react';
import { AnyJson } from '@polkadot/types/types';
import { Hex, ProgramMetadata } from '@gear-js/api';
import { useApi, useAlert } from '@gear-js/react-hooks';

const useStateRead = (programId: Hex, metadata: ProgramMetadata | undefined) => {
  const alert = useAlert();
  const { api } = useApi();

  const [state, setState] = useState<AnyJson>();
  const [isReaded, setIsReaded] = useState(true);

  const readState = useCallback(
    async (initValue?: AnyJson) => {
      if (metadata) {
        try {
          setIsReaded(false);

          //
          const result = await api.programState.read({ programId }, metadata);

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
    [api, programId, metadata],
  );

  const resetState = () => setState(undefined);

  return { readState, resetState, state, isReaded };
};

export { useStateRead };
