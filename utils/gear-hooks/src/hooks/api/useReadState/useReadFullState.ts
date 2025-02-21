import { MessagesDispatched, ProgramMetadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { useEffect, useState } from 'react';
import { useAlert, useApi } from '@/context';

function useReadFullState<T = AnyJson>(
  programId: HexString | undefined,
  meta: ProgramMetadata | undefined,
  payload: AnyJson,
  isReadOnError?: boolean,
) {
  const { api } = useApi();
  const alert = useAlert();

  const [state, setState] = useState<T>();
  const [isStateRead, setIsStateRead] = useState(true);
  const [error, setError] = useState('');

  const isPayload = payload !== undefined;

  const readFullState = (isInitLoad?: boolean) => {
    if (!api || !programId || !meta || !isPayload) return;

    if (isInitLoad) setIsStateRead(false);

    api.programState
      .read({ programId, payload }, meta)
      .then((codecState) => codecState.toHuman())
      .then((result) => {
        setState(result as unknown as T);
        if (!isReadOnError) setIsStateRead(true);
      })
      .catch(({ message }: Error) => setError(message))
      .finally(() => {
        if (isReadOnError) setIsStateRead(true);
      });
  };

  const handleStateChange = ({ data }: MessagesDispatched) => {
    const changedIDs = data.stateChanges.toHuman() as HexString[];
    const isAnyChange = changedIDs.some((id) => id === programId);

    if (isAnyChange) readFullState();
  };

  useEffect(() => {
    if (!api || !programId || !meta || !isPayload) return;

    const unsub = api.gearEvents.subscribeToGearEvent('MessagesDispatched', handleStateChange);

    return () => {
      unsub.then((unsubCallback) => unsubCallback());
    };
  }, [api, programId, meta, payload]);

  useEffect(() => {
    readFullState(true);
    setError('');
  }, [api, programId, meta, payload]);

  useEffect(() => {
    if (error) alert.error(error);
  }, [error]);

  return { state, isStateRead, error };
}

export { useReadFullState };
