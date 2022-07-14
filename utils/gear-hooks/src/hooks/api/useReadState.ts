import { Hex, MessagesDispatched } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { UnsubscribePromise } from '@polkadot/api/types';
import { useEffect, useState, useContext } from 'react';
import { AlertContext, ApiContext } from 'context';
import { useConditionalMetaBuffer } from './useMetadata';

type State<T> = { state: T | undefined; isStateRead: boolean; error: string };

function useReadState<T = AnyJson>(
  programId: Hex | undefined,
  metaSourceOrBuffer: string | Buffer | undefined,
  payload?: AnyJson,
  isReadOnError?: boolean,
): State<T> {
  const { api } = useContext(ApiContext); // сircular dependency fix
  const alert = useContext(AlertContext);

  const metaBuffer = useConditionalMetaBuffer(metaSourceOrBuffer);

  const [state, setState] = useState<T>();
  const [error, setError] = useState('');
  const [isStateRead, setIsStateRead] = useState(true);

  const readState = (isInitLoad?: boolean) => {
    if (programId && metaBuffer && payload) {
      if (isInitLoad) setIsStateRead(false);

      api.programState
        .read(programId, metaBuffer, payload)
        .then((codecState) => codecState.toHuman())
        .then((result) => {
          setState(result as unknown as T);
          if (!isReadOnError) setIsStateRead(true);
        })
        .catch(({ message }: Error) => setError(message))
        .finally(() => {
          if (isReadOnError) setIsStateRead(true);
        });
    }
  };

  useEffect(() => {
    readState(true);
    setError('');
  }, [programId, metaBuffer, payload]);

  const handleStateChange = ({ data }: MessagesDispatched) => {
    const changedIDs = data.stateChanges.toHuman() as Hex[];
    const isAnyChange = changedIDs.some((id) => id === programId);

    if (isAnyChange) readState();
  };

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (api && programId && metaBuffer && payload) {
      unsub = api.gearEvents.subscribeToGearEvent('MessagesDispatched', handleStateChange);
    }

    return () => {
      if (unsub) unsub.then((unsubCallback) => unsubCallback());
    };
  }, [api, programId, metaBuffer, payload]);

  useEffect(() => {
    if (error) alert.error(error);
  }, [error]);

  return { state, isStateRead, error };
}

export { useReadState };
