import { Hex, MessagesDispatched } from '@gear-js/api';
import { UnsubscribePromise } from '@polkadot/api/types';
import { useContext, useEffect } from 'react';
import { ApiContext } from 'context';

function useStateSubscription(programId: Hex | undefined, onStateChange: () => void, dependency?: boolean) {
  const { api } = useContext(ApiContext); // сircular dependency fix

  const handleStateChange = ({ data }: MessagesDispatched) => {
    const changedIDs = data.stateChanges.toHuman() as Hex[];
    const isAnyChange = changedIDs.some((id) => id === programId);

    if (isAnyChange) onStateChange();
  };

  useEffect(() => {
    const isDependency = dependency !== undefined;
    let unsub: UnsubscribePromise | undefined;

    if (!programId || (isDependency && !dependency)) return;

    unsub = api?.gearEvents.subscribeToGearEvent('MessagesDispatched', handleStateChange);

    return () => {
      unsub?.then((unsubCallback) => unsubCallback());
    };
  }, [api, programId, dependency]);
}

export { useStateSubscription };
