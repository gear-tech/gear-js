import { useAccount, useAlert, useApi } from '@gear-js/react-hooks';
import type { UnsubscribePromise } from '@polkadot/api/types';
import { useEffect } from 'react';

import { Method } from '@/features/explorer';

import { messageSentEventsHandler, transferEventsHandler } from './helpers';

const useEventSubscriptions = () => {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();
  const alert = useAlert();

  const { address, decodedAddress } = account || {};

  useEffect(() => {
    if (!isApiReady || !decodedAddress || !address) return;

    const unsubs: UnsubscribePromise[] = [];

    unsubs.push(
      api.gearEvents.subscribeToGearEvent(Method.UserMessageSent, (event) =>
        messageSentEventsHandler(event, decodedAddress, alert, api.specVersion),
      ),
      api.gearEvents.subscribeToTransferEvents((event) => transferEventsHandler(event, decodedAddress, alert)),
    );

    return () => {
      if (unsubs.length) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises -- TODO(#1800): resolve eslint comments
        Promise.all(unsubs).then((result) => {
          result.forEach((unsubscribe) => void unsubscribe());
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedAddress, address, isApiReady]);
};

export { useEventSubscriptions };
