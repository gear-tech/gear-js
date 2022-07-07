import { useCallback } from 'react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { Hex, UserMessageRead } from '@gear-js/api';
import { useApi, useAccount, useAlert, DEFAULT_SUCCESS_OPTIONS, DEFAULT_ERROR_OPTIONS } from '@gear-js/react-hooks';

import { getExtrinsicFailedMessage } from 'helpers';

const useClaimMessage = () => {
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();

  const claimMessage = useCallback(
    async (messageId: Hex, callback: () => void) => {
      if (!account) {
        alert.error('Wallet no connected');

        return;
      }

      const { meta, address } = account;

      const alertId = alert.loading('SignIn', { title: 'gear.claimValueFromMailbox' });

      try {
        api.claimValueFromMailbox.submit(messageId);

        const { signer } = await web3FromSource(meta.source);

        await api.claimValueFromMailbox.signAndSend(address, { signer }, ({ status, events }) => {
          if (status.isReady) {
            alert.update(alertId, 'Ready');

            return;
          }

          if (status.isInBlock) {
            alert.update(alertId, 'InBlock');

            events.forEach(({ event }) => {
              const { method, section, data } = event as UserMessageRead;

              const title = `${section}.${method}`;

              if (method === 'UserMessageRead') {
                const reason = data.reason.toHuman() as { [key: string]: string };
                const reasonKey = Object.keys(reason)[0];
                const reasonValue = reason[reasonKey];

                const message = `${data.id.toHuman()}\n ${reasonKey}: ${reasonValue}`;

                alert.success(message, { title });

                return;
              }

              if (method === 'ExtrinsicFailed') {
                alert.error(getExtrinsicFailedMessage(api, event), { title });

                return;
              }
            });

            return;
          }

          if (status.isFinalized) {
            alert.update(alertId, 'Finalized', DEFAULT_SUCCESS_OPTIONS);

            callback();
          }
        });
      } catch (error) {
        const message = (error as Error).message;

        alert.update(alertId, message, DEFAULT_ERROR_OPTIONS);

        return Promise.reject(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, account]
  );

  return claimMessage;
};

export { useClaimMessage };
