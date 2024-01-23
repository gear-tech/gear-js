import { useCallback } from 'react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { EventRecord } from '@polkadot/types/interfaces';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { useApi, useAlert, useAccount, DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from '@gear-js/react-hooks';

import { useModal } from '@/hooks';
import { Method } from '@/features/explorer';
import { OperationCallbacks } from '@/entities/hooks';
import { checkWallet, getExtrinsicFailedMessage } from '@/shared/helpers';
import { PROGRAM_ERRORS, TransactionStatus, TransactionName } from '@/shared/config';

import { ParamsToSendMessage, ParamsToSignAndSend, ParamsToReplyMessage } from './types';

const useMessageActions = () => {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();
  const alert = useAlert();
  const { showModal } = useModal();

  const handleEventsStatus = (events: EventRecord[], { reject, resolve }: OperationCallbacks) => {
    if (!isApiReady) throw new Error('API is not initialized');

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

  const signAndSend = async ({
    extrinsic,
    signer,
    title = TransactionName.SendMessage,
    reject,
    resolve,
  }: ParamsToSignAndSend) => {
    const alertId = alert.loading('SignIn', { title });

    try {
      if (!isApiReady) throw new Error('API is not initialized');

      await extrinsic.signAndSend(account!.address, { signer }, ({ events, status }) => {
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
    async ({ metadata, message, payloadType, withVoucher, reject, resolve }: ParamsToSendMessage) => {
      try {
        if (!isApiReady) throw new Error('API is not initialized');
        checkWallet(account);

        const { meta, address } = account!;

        const sendExtrinsic = api.message.send(message, metadata, payloadType);

        const extrinsic = withVoucher ? api.voucher.call({ SendMessage: sendExtrinsic }) : sendExtrinsic;

        const { signer } = await web3FromSource(meta.source);
        const { partialFee } = await api.message.paymentInfo(address, { signer });

        const handleConfirm = () => signAndSend({ extrinsic, signer, reject, resolve });

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
    async ({ reply, metadata, payloadType, withVoucher, reject, resolve }: ParamsToReplyMessage) => {
      try {
        if (!isApiReady) throw new Error('API is not initialized');
        checkWallet(account);

        const { meta, address } = account!;

        const replyExtrinsic = await api.message.sendReply(reply, metadata, payloadType);

        const extrinsic = withVoucher ? api.voucher.call({ SendReply: replyExtrinsic }) : replyExtrinsic;

        const { signer } = await web3FromSource(meta.source);
        const { partialFee } = await api.message.paymentInfo(address, { signer });

        const handleConfirm = () =>
          signAndSend({ extrinsic, signer, title: TransactionName.SendReply, reject, resolve });

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
