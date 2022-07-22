import { useCallback } from 'react';
import { AddressOrPair } from '@polkadot/api/types';
import { useApi, useAlert } from '@gear-js/react-hooks';

import { getExtrinsicFailedMessage } from 'helpers';
import { GEAR_BALANCE_TRANSFER_VALUE } from 'consts';
import { Method } from 'types/explorer';

const useBalanceTransfer = () => {
  const alert = useAlert();
  const { api } = useApi();

  const transferBalance = useCallback(
    async (addressTo: string, addressFrom: AddressOrPair) => {
      try {
        api.balance.transfer(addressTo, GEAR_BALANCE_TRANSFER_VALUE);

        await api.balance.signAndSend(addressFrom, ({ events }) => {
          events.forEach(({ event }) => {
            const { method, section } = event;

            const alertOptions = { title: `${section}.${method}` };

            if (method === Method.Transfer) {
              alert.success('Balance received successfully', alertOptions);

              return;
            }

            if (method === Method.ExtrinsicFailed) {
              alert.error(getExtrinsicFailedMessage(api, event), alertOptions);
            }
          });
        });
      } catch (error) {
        const message = (error as Error).message;

        alert.error(message);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api]
  );

  return transferBalance;
};

export { useBalanceTransfer };
