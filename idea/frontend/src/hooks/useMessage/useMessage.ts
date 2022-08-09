import { useCallback } from 'react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useApi, useAlert, useAccount, DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from '@gear-js/react-hooks';

import { useModal } from '../index';
import { SendMessageParams, ReplyMessageParams, SignAndSendArg } from './types';

import { getExtrinsicFailedMessage } from 'helpers';
import { ACCOUNT_ERRORS, PROGRAM_ERRORS, TransactionStatus, TransactionName } from 'consts';
import { Method } from 'types/explorer';
import { TransactionModal, TransactionModalProps } from 'components/modals/TransactionModal';

const useMessage = () => {
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();
  const { showModal } = useModal();

  const signAndSend = async ({ signer, isReply = false, reject, resolve }: SignAndSendArg) => {
    const alertId = alert.loading('SignIn', {
      title: isReply ? TransactionName.SendReply : TransactionName.SendMessage,
    });

    try {
      await api.message.signAndSend(account!.address, { signer }, (data) => {
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
              reject();

              return;
            }

            if (method === Method.MessageEnqueued) {
              alert.success('Success', alertOptions);
              resolve();
            }
          });

          return;
        }

        if (data.status.isInvalid) {
          alert.update(alertId, PROGRAM_ERRORS.INVALID_TRANSACTION, DEFAULT_ERROR_OPTIONS);
          reject();
        }
      });
    } catch (error) {
      const message = (error as Error).message;

      alert.update(alertId, message, DEFAULT_ERROR_OPTIONS);
      reject();
    }
  };

  const sendMessage = useCallback(
    async ({ metadata, message, payloadType, reject, resolve }: SendMessageParams) => {
      try {
        if (!account) {
          throw new Error(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED);
        }

        const { meta, address } = account;

        api.message.send(message, metadata, payloadType);

        const { signer } = await web3FromSource(meta.source);
        const { partialFee } = await api.message.paymentInfo(address, { signer });

        const handleConfirm = () =>
          signAndSend({
            signer,
            reject,
            resolve,
          });

        showModal<TransactionModalProps>(TransactionModal, {
          fee: partialFee.toHuman(),
          name: TransactionName.SendMessage,
          addressTo: message.destination as string,
          addressFrom: address,
          onCancel: reject,
          onConfirm: handleConfirm,
        });
      } catch (error) {
        const errorMessage = (error as Error).message;

        alert.error(errorMessage);
        reject();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, account]
  );

  const replyMessage = useCallback(
    async ({ reply, metadata, payloadType, reject, resolve }: ReplyMessageParams) => {
      try {
        if (!account) {
          throw new Error(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED);
        }

        const { meta, address } = account;

        api.message.sendReply(reply, metadata, payloadType);

        const { signer } = await web3FromSource(meta.source);
        const { partialFee } = await api.message.paymentInfo(address, { signer });

        const handleConfirm = () =>
          signAndSend({
            signer,
            isReply: true,
            reject,
            resolve,
          });

        showModal<TransactionModalProps>(TransactionModal, {
          fee: partialFee.toHuman(),
          name: TransactionName.SendReply,
          addressTo: reply.replyToId,
          addressFrom: address,
          onCancel: reject,
          onConfirm: handleConfirm,
        });
      } catch (error) {
        const errorMessage = (error as Error).message;

        alert.error(errorMessage);
        reject();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, account]
  );

  return { sendMessage, replyMessage };
};

export { useMessage };
