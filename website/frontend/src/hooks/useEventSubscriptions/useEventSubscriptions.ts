import { useEffect } from 'react';
import { UnsubscribePromise } from '@polkadot/api/types';

import { transferEventsHandler, messageSentEventsHandler } from './helpers';

import { useAccount, useApi, useAlert } from 'hooks';
import { Method } from 'types/explorer';

const useEventSubscriptions = () => {
  const alert = useAlert();
  const { account } = useAccount();
  const { api, isApiReady } = useApi();

  const decodedAddress = account?.decodedAddress;

  useEffect(() => {
    if (!isApiReady || !decodedAddress) {
      return;
    }

    const unsubs: UnsubscribePromise[] = [];

    unsubs.push(
      api.gearEvents.subscribeToGearEvent(Method.UserMessageSent, (event) =>
        messageSentEventsHandler(event, decodedAddress, alert)
      ),
      api.gearEvents.subscribeToTransferEvents((event) => transferEventsHandler(event, decodedAddress, alert))
    );

    return () => {
      if (unsubs.length) {
        unsubs.forEach((unsubPromise) => {
          unsubPromise.then((unsubscribe) => unsubscribe());
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedAddress, isApiReady]);
};

export { useEventSubscriptions };
