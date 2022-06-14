import { ProgramId } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { useEffect, useState, useContext } from 'react';
import { AlertContext, ApiContext } from 'context';
import { useConditionalMetaBuffer } from './useMetadata';

type State<T> = { state: T | undefined; isStateRead: boolean };

function useReadState<T = AnyJson>(
  programId: ProgramId,
  metaSourceOrBuffer: string | Buffer | undefined,
  payload?: AnyJson,
): State<T> {
  const { api } = useContext(ApiContext); // сircular dependency fix
  const alert = useContext(AlertContext);

  const metaBuffer = useConditionalMetaBuffer(metaSourceOrBuffer);

  const [state, setState] = useState<T>();
  const [isStateRead, setIsStateRead] = useState(false);

  useEffect(() => {
    if (metaBuffer && payload) {
      setIsStateRead(false);

      api.programState
        .read(programId, metaBuffer, payload)
        .then((codecState) => codecState.toHuman())
        .then((result) => setState(result as unknown as T))
        .catch(({ message }: Error) => alert.error(message))
        .finally(() => setIsStateRead(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaBuffer, payload]);

  return { state, isStateRead };
}

export { useReadState };
