import { useCallback } from 'react';
import { Metadata } from '@gear-js/api';
import { web3FromSource } from '@polkadot/extension-dapp';

import { PROGRAM_ERRORS, TransactionStatus } from 'consts';
import { useAccount, useApi, useAlert } from 'hooks';
import { Method } from 'types/explorer';
import { Message, Reply } from 'types/program';
import { DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from 'context/alert/const';

const useSendMessage = () => {
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();

  const sendMessage = useCallback(
    async (
      extrinsic: 'handle' | 'reply',
      message: Message & Reply,
      callback: () => void,
      meta?: Metadata,
      payloadType?: string
    ) => {
      try {
        if (!account) {
          throw new Error('Wallet not connected');
        }

        const alertId = alert.loading('SignIn', { title: 'gear.sendMessage' });

        const { signer } = await web3FromSource(account.meta.source);
        const apiExtrinsic = extrinsic === 'handle' ? api.message : api.reply;

        apiExtrinsic.submit(message, meta, payloadType);

        await apiExtrinsic
          .signAndSend(account.address, { signer }, (data) => {
            if (data.status.isReady) {
              alert.update(alertId, TransactionStatus.Ready);

              return;
            }

            if (data.status.isInBlock) {
              alert.update(alertId, TransactionStatus.InBlock);

              return;
            }

            if (data.status.isFinalized) {
              alert.update(alertId, TransactionStatus.Finalized, DEFAULT_SUCCESS_OPTIONS);

              data.events.forEach(({ event }) => {
                const { method, section } = event;

                const eventTitle = `${section}.${method}`;

                if (method === Method.MessageEnqueued) {
                  alert.success('Success', { title: eventTitle });
                  callback();

                  return;
                }

                if (method === Method.ExtrinsicFailed) {
                  alert.error('Extrinsic Failed', { title: eventTitle });
                }
              });

              return;
            }

            if (data.status.isInvalid) {
              alert.update(alertId, PROGRAM_ERRORS.INVALID_TRANSACTION, DEFAULT_ERROR_OPTIONS);
            }
          })
          .catch((error) => {
            alert.update(alertId, error.message, DEFAULT_ERROR_OPTIONS);
          });
      } catch (error) {
        alert.error((error as Error).message);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, account]
  );

  return sendMessage;
};

export { useSendMessage };
