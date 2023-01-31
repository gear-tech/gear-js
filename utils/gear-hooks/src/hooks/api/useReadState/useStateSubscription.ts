import { MessagesDispatched } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { useContext, useEffect } from 'react';
import { ApiContext } from 'context';

function useStateSubscription(programId: HexString | undefined, onStateChange: () => void, dependency?: boolean) {
  const { api } = useContext(ApiContext); // сircular dependency fix

  const handleStateChange = ({ data }: MessagesDispatched) => {
    const changedIDs = data.stateChanges.toHuman() as HexString[];
    const isAnyChange = changedIDs.some((id) => id === programId);

    if (isAnyChange) onStateChange();
  };

  useEffect(() => {
    const isDependency = dependency !== undefined;

    if (!programId || (isDependency && !dependency)) return;

    const unsub = api?.gearEvents.subscribeToGearEvent('MessagesDispatched', handleStateChange);

    return () => {
      unsub?.then((unsubCallback) => unsubCallback());
    };
  }, [api, programId, dependency]);
}

export { useStateSubscription };
