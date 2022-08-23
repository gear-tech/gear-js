import { useCallback } from 'react';
import { AddressOrPair } from '@polkadot/api/types';
import { EventRecord } from '@polkadot/types/interfaces';
import { useApi, useAlert } from '@gear-js/react-hooks';

import { Method } from 'shared/types/explorer';
import { getExtrinsicFailedMessage } from 'shared/helpers';
import { GEAR_BALANCE_TRANSFER_VALUE } from 'shared/config';

const useBalanceTransfer = () => {
  const alert = useAlert();
  const { api } = useApi();

  const handleEventsStatus = (events: EventRecord[]) => {
    events.forEach(({ event }) => {
      const { method, section } = event;

      const alertOptions = { title: `${section}.${method}` };

      if (method === Method.Transfer) {
        alert.success('Balance received successfully', alertOptions);
      } else if (method === Method.ExtrinsicFailed) {
        alert.error(getExtrinsicFailedMessage(api, event), alertOptions);
      }
    });
  };

  const transferBalance = useCallback(
    async (addressTo: string, addressFrom: AddressOrPair) => {
      try {
        api.balance.transfer(addressTo, GEAR_BALANCE_TRANSFER_VALUE);

        await api.balance.signAndSend(addressFrom, ({ events }) => handleEventsStatus(events));
      } catch (error) {
        const message = (error as Error).message;

        alert.error(message);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api],
  );

  return transferBalance;
};

export { useBalanceTransfer };
