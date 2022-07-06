import { Hex, MessagesDispatched, ProgramId } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { UnsubscribePromise } from '@polkadot/api/types';
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

  const readState = (isInitLoad?: boolean) => {
    if (metaBuffer && payload) {
      if (isInitLoad) setIsStateRead(false);

      api.programState
        .read(programId, metaBuffer, payload)
        .then((codecState) => codecState.toHuman())
        .then((result) => {
          setState(result as unknown as T);
          setIsStateRead(true);
        })
        .catch(({ message }: Error) => alert.error(message));
    }
  };

  useEffect(() => {
    readState(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaBuffer, payload]);

  const handleStateChange = ({ data }: MessagesDispatched) => {
    const changedIDs = data.stateChanges.toHuman() as Hex[];
    const isAnyChange = changedIDs.some((id) => id === programId);

    if (isAnyChange) readState();
  };

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (api && metaBuffer && payload) {
      unsub = api.gearEvents.subscribeToGearEvent('MessagesDispatched', handleStateChange);
    }

    return () => {
      if (unsub) unsub.then((unsubCallback) => unsubCallback());
    };
  }, [api, metaBuffer, payload]);

  return { state, isStateRead };
}

export { useReadState };
