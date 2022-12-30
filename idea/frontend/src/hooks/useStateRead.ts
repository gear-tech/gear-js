import { useState, useCallback } from 'react';
import { AnyJson, Codec } from '@polkadot/types/types';
import { getStateMetadata, Hex, ProgramMetadata } from '@gear-js/api';
import { useApi, useAlert } from '@gear-js/react-hooks';

const useStateRead = (programId: Hex, metadataOrWasm: ProgramMetadata | Uint8Array | undefined) => {
  const alert = useAlert();
  const { api } = useApi();

  const [state, setState] = useState<AnyJson>();
  const [isReaded, setIsReaded] = useState(true);

  const readState = useCallback(
    async (fnName = '') => {
      if (metadataOrWasm) {
        try {
          setIsReaded(false);

          const isWasm = metadataOrWasm instanceof Uint8Array;
          let result: Codec;

          if (isWasm) {
            const meta = await getStateMetadata(metadataOrWasm);
            result = await api.programState.readUsingWasm({ programId, wasm: metadataOrWasm, fn_name: fnName }, meta);
          } else {
            result = await api.programState.read({ programId }, metadataOrWasm);
          }

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
    [api, programId, metadataOrWasm],
  );

  const resetState = () => setState(undefined);

  return { readState, resetState, state, isReaded };
};

export { useStateRead };
