import { useEffect } from 'react';
import { UnsubscribePromise } from '@polkadot/api/types';
import { useApi, useAccount, useAlert } from '@gear-js/react-hooks';

import { transferEventsHandler, messageSentEventsHandler } from './helpers';

import { Method } from 'types/explorer';

const useEventSubscriptions = () => {
  const alert = useAlert();
  const { api, isApiReady } = useApi();
  const { account } = useAccount();

  const { address, decodedAddress } = account || {};

  useEffect(() => {
    if (!isApiReady || !decodedAddress || !address) {
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
        Promise.all(unsubs).then((result) => {
          result.forEach((unsubscribe) => unsubscribe());
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedAddress, address, isApiReady]);
};

export { useEventSubscriptions };
