import { useCallback } from 'react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { EventRecord } from '@polkadot/types/interfaces';
import { useApi, useAlert, useAccount, DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from '@gear-js/react-hooks';

import { useModal } from 'hooks';
import { Method } from 'entities/explorer';
import { OperationCallbacks } from 'entities/hooks';
import { checkWallet, getExtrinsicFailedMessage } from 'shared/helpers';
import { PROGRAM_ERRORS, TransactionStatus, TransactionName } from 'shared/config';

import { ParamsToSendMessage, ParamsToSignAndSend, ParamsToReplyMessage } from './types';

const useMessageActions = () => {
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();
  const { showModal } = useModal();

  const handleEventsStatus = (events: EventRecord[], { reject, resolve }: OperationCallbacks) => {
    events.forEach(({ event }) => {
      const { method, section } = event;
      const alertOptions = { title: `${section}.${method}` };

      if (method === Method.ExtrinsicFailed) {
        alert.error(getExtrinsicFailedMessage(api, event), alertOptions);

        if (reject) reject();
      } else if (method === Method.MessageQueued) {
        alert.success('Success', alertOptions);

        if (resolve) resolve();
      }
    });
  };

  const signAndSend = async ({ signer, title = TransactionName.SendMessage, reject, resolve }: ParamsToSignAndSend) => {
    const alertId = alert.loading('SignIn', { title });

    try {
      await api.message.signAndSend(account!.address, { signer }, ({ events, status }) => {
        if (status.isReady) {
          alert.update(alertId, TransactionStatus.Ready);
        } else if (status.isInBlock) {
          alert.update(alertId, TransactionStatus.InBlock);
        } else if (status.isFinalized) {
          alert.update(alertId, TransactionStatus.Finalized, DEFAULT_SUCCESS_OPTIONS);
          handleEventsStatus(events, { reject, resolve });
        } else if (status.isInvalid) {
          alert.update(alertId, PROGRAM_ERRORS.INVALID_TRANSACTION, DEFAULT_ERROR_OPTIONS);

          if (reject) reject();
        }
      });
    } catch (error) {
      const message = (error as Error).message;

      alert.update(alertId, message, DEFAULT_ERROR_OPTIONS);

      if (reject) reject();
    }
  };

  const sendMessage = useCallback(
    async ({ metadata, message, payloadType, reject, resolve }: ParamsToSendMessage) => {
      try {
        checkWallet(account);

        const { meta, address } = account!;

        api.message.send(message, metadata, payloadType);

        const { signer } = await web3FromSource(meta.source);
        const { partialFee } = await api.message.paymentInfo(address, { signer });

        const handleConfirm = () =>
          signAndSend({
            signer,
            reject,
            resolve,
          });

        showModal('transaction', {
          fee: partialFee.toHuman(),
          name: TransactionName.SendMessage,
          addressTo: message.destination as string,
          addressFrom: address,
          onAbort: reject,
          onConfirm: handleConfirm,
        });
      } catch (error) {
        const errorMessage = (error as Error).message;

        alert.error(errorMessage);

        if (reject) reject();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, account],
  );

  const replyMessage = useCallback(
    async ({ reply, metadata, payloadType, reject, resolve }: ParamsToReplyMessage) => {
      try {
        checkWallet(account);

        const { meta, address } = account!;

        api.message.sendReply(reply, metadata, payloadType);

        const { signer } = await web3FromSource(meta.source);
        const { partialFee } = await api.message.paymentInfo(address, { signer });

        const handleConfirm = () =>
          signAndSend({
            signer,
            title: TransactionName.SendReply,
            reject,
            resolve,
          });

        showModal('transaction', {
          fee: partialFee.toHuman(),
          name: TransactionName.SendReply,
          addressTo: reply.replyToId,
          addressFrom: address,
          onAbort: reject,
          onConfirm: handleConfirm,
        });
      } catch (error) {
        const errorMessage = (error as Error).message;

        alert.error(errorMessage);

        if (reject) reject();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, account],
  );

  return { sendMessage, replyMessage };
};

export { useMessageActions };
