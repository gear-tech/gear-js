import { useCallback } from 'react';
import { Hex } from '@gear-js/api';
import { web3FromSource } from '@polkadot/extension-dapp';

// eslint-disable-next-line import/no-cycle
import { useApi, useAccount, useAlert } from '.';
import { DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from 'context/alert/const';

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

        await api.claimValueFromMailbox.signAndSend(address, { signer }, ({ status }) => {
          if (status.isBroadcast) {
            alert.update(alertId, 'Broadcast');

            return;
          }

          if (status.isReady) {
            alert.update(alertId, 'Ready');

            return;
          }

          if (status.isInBlock) {
            alert.update(alertId, 'InBlock');

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
