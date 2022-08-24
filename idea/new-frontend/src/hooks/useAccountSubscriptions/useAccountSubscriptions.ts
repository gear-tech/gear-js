import { useEffect } from 'react';
import { UnsubscribePromise } from '@polkadot/api/types';
import { useApi, useAccount, useAlert } from '@gear-js/react-hooks';

import { Method } from 'entities/explorer';
import { transferEventsHandler, messageSentEventsHandler } from './helpers';

const useAccountSubscriptions = () => {
  const alert = useAlert();
  const { api, isApiReady } = useApi();
  const { account, updateBalance } = useAccount();

  const { address, decodedAddress } = account || {};

  useEffect(() => {
    if (!isApiReady || !decodedAddress || !address) {
      return;
    }

    const unsubs: UnsubscribePromise[] = [];

    unsubs.push(
      api.gearEvents.subscribeToBalanceChange(address, updateBalance),
      api.gearEvents.subscribeToGearEvent(Method.UserMessageSent, (event) =>
        messageSentEventsHandler(event, decodedAddress, alert),
      ),
      api.gearEvents.subscribeToTransferEvents((event) => transferEventsHandler(event, decodedAddress, alert)),
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

export { useAccountSubscriptions };
