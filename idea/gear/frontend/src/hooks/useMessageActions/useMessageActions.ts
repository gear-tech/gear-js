import { useApi, useAlert, useAccount } from '@gear-js/react-hooks';
import { useCallback } from 'react';

import { Method } from '@/features/explorer';
import { useModal, useSignAndSend } from '@/hooks';
import { TransactionName } from '@/shared/config';
import { checkWallet } from '@/shared/helpers';

import { ParamsToSendMessage, ParamsToReplyMessage } from './types';

const useMessageActions = () => {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();
  const alert = useAlert();
  const { showModal } = useModal();
  const signAndSend = useSignAndSend();

  const sendMessage = useCallback(
    async ({ metadata, message, payloadType, voucherId, reject, resolve }: ParamsToSendMessage) => {
      try {
        if (!isApiReady) throw new Error('API is not initialized');
        checkWallet(account);

        const { address, signer } = account!;

        const sendExtrinsic = api.message.send(message, metadata, payloadType);

        const extrinsic = voucherId ? api.voucher.call(voucherId, { SendMessage: sendExtrinsic }) : sendExtrinsic;

        const { partialFee } = await api.message.paymentInfo(address, { signer });

        const handleConfirm = () =>
          signAndSend(extrinsic, Method.MessageQueued, { onSuccess: resolve, onError: reject });

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
    async ({ reply, metadata, payloadType, voucherId, reject, resolve }: ParamsToReplyMessage) => {
      try {
        if (!isApiReady) throw new Error('API is not initialized');
        checkWallet(account);

        const { address, signer } = account!;

        const replyExtrinsic = await api.message.sendReply(reply, metadata, payloadType);

        const extrinsic = voucherId ? api.voucher.call(voucherId, { SendReply: replyExtrinsic }) : replyExtrinsic;

        const { partialFee } = await api.message.paymentInfo(address, { signer });

        const handleConfirm = () =>
          signAndSend(extrinsic, Method.MessageQueued, { onSuccess: resolve, onError: reject });

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
