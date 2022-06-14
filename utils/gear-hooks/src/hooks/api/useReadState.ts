import { ProgramId } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { useEffect, useState, useContext } from 'react';
import { AlertContext, ApiContext } from 'context';
import { useConditionalMetaBuffer } from './useMetadata';

function useReadState(programId: ProgramId, metaSourceOrBuffer: string | Buffer | undefined, payload?: AnyJson) {
  const { api } = useContext(ApiContext); // сircular dependency fix
  const alert = useContext(AlertContext);

  const metaBuffer = useConditionalMetaBuffer(metaSourceOrBuffer);

  const [state, setState] = useState<AnyJson>();

  useEffect(() => {
    if (metaBuffer && payload) {
      api.programState
        .read(programId, metaBuffer, payload)
        .then((codecState) => codecState.toHuman())
        .then(setState)
        .catch(({ message }: Error) => alert.error(message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaBuffer, payload]);

  return state;
}

export { useReadState };
