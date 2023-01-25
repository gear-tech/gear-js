import { Hex, MessagesDispatched, ProgramMetadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { UnsubscribePromise } from '@polkadot/api/types';
import { useEffect, useState } from 'react';
import { useAlert, useApi } from '@gear-js/react-hooks';

type State<T> = { state: T | undefined; isStateRead: boolean; error: string };

export function useReadState<T = AnyJson>(
  programId: Hex | undefined,
  meta: ProgramMetadata | undefined,
  payload?: AnyJson,
  isReadOnError?: boolean,
): State<T> {
  const { api } = useApi();
  const alert = useAlert();

  const [state, setState] = useState<T>();
  const [error, setError] = useState('');
  const [isStateRead, setIsStateRead] = useState(true);

  const readState = (isInitLoad?: boolean) => {
    if (programId && meta && payload) {
      if (isInitLoad) setIsStateRead(false);

      api.programState
        .read({ programId }, meta)
        .then((codecState) => codecState.toJSON())
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
  }, [programId, payload]);

  const handleStateChange = ({ data }: MessagesDispatched) => {
    const changedIDs = data.stateChanges.toHuman() as Hex[];
    const isAnyChange = changedIDs.some((id) => id === programId);

    if (isAnyChange) readState();
  };

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;
    console.log('prepare to unsubscribe');

    if (api && programId && payload) {
      unsub = api.gearEvents.subscribeToGearEvent('MessagesDispatched', handleStateChange);
    }

    return () => {
      if (unsub) {
        console.log('unsubscribed');
        unsub.then((unsubCallback) => unsubCallback());
      }
    };
  }, [api, programId, payload]);

  useEffect(() => {
    if (error) alert.error(error);
  }, [error]);

  return { state, isStateRead, error };
}
