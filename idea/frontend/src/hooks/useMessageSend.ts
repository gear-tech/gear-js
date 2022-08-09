import { useCallback } from 'react';
import { Metadata, IMessageSendOptions, IMessageSendReplyOptions } from '@gear-js/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useAccount, useApi, useAlert, DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from '@gear-js/react-hooks';

import { getExtrinsicFailedMessage } from 'helpers';
import { PROGRAM_ERRORS, TransactionStatus } from 'consts';
import { Method } from 'types/explorer';

const useSendMessage = () => {
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();

  const sendMessage = useCallback(
    async (
      extrinsic: 'handle' | 'reply',
      message: IMessageSendOptions & IMessageSendReplyOptions,
      callback: () => void,
      meta?: Metadata,
      payloadType?: string
    ) => {
      if (!account) {
        alert.error('Wallet not connected');

        return;
      }

      const alertId = alert.loading('SignIn', { title: 'gear.sendMessage' });

      try {
        const { signer } = await web3FromSource(account.meta.source);
        const apiExtrinsic = extrinsic === 'handle' ? api.message.send : api.message.sendReply;

        apiExtrinsic(message, meta, payloadType);

        await api.message.signAndSend(account.address, { signer }, (data) => {
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

              const alertOptions = { title: `${section}.${method}` };

              if (method === Method.ExtrinsicFailed) {
                alert.error(getExtrinsicFailedMessage(api, event), alertOptions);

                return;
              }

              if (method === Method.MessageEnqueued) {
                alert.success('Success', alertOptions);
                callback();
              }
            });

            return;
          }

          if (data.status.isInvalid) {
            alert.update(alertId, PROGRAM_ERRORS.INVALID_TRANSACTION, DEFAULT_ERROR_OPTIONS);
          }
        });
      } catch (error) {
        const errorMessage = (error as Error).message;

        alert.update(alertId, errorMessage, DEFAULT_ERROR_OPTIONS);

        return Promise.reject(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, account]
  );

  return sendMessage;
};

export { useSendMessage };
