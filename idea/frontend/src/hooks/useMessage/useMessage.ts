import { useCallback } from 'react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useApi, useAlert, useAccount } from '@gear-js/react-hooks';

import { useModal } from '../index';
import { signAndSend } from './helpers';
import { SendMessageParams, ReplyMessageParams } from './types';

import { ACCOUNT_ERRORS, TransactionName } from 'consts';
import { TransactionModal, TransactionModalProps } from 'components/modals/TransactionModal';

const useMessage = () => {
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();
  const { showModal } = useModal();

  const sendMessage = useCallback(
    async ({ metadata, message, payloadType, reject, resolve }: SendMessageParams) => {
      if (!account) {
        alert.error(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED);

        return;
      }

      const { meta, address } = account;

      try {
        // TODO: fix message type
        api.message.submit(message as any, metadata, payloadType);

        const { signer } = await web3FromSource(meta.source);

        const { partialFee } = await api.message.paymentInfo(address, { signer });

        const handleConfirm = () =>
          signAndSend({
            api,
            alert,
            signer,
            address,
            reject,
            resolve,
          });

        showModal<TransactionModalProps>(TransactionModal, {
          fee: partialFee.toHuman(),
          name: TransactionName.SendMessage,
          addressTo: message.destination,
          addressFrom: account.address,
          onCancel: reject,
          onConfirm: handleConfirm,
        });
      } catch (error) {
        const errorMessage = (error as Error).message;

        reject();
        alert.error(errorMessage);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, account]
  );

  const replyMessage = useCallback(
    async ({ reply, metadata, payloadType, reject, resolve }: ReplyMessageParams) => {
      if (!account) {
        alert.error(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED);

        return;
      }

      const { meta, address } = account;

      try {
        api.reply.submit(reply as any, metadata, payloadType);

        const { signer } = await web3FromSource(meta.source);
        const { partialFee } = await api.reply.paymentInfo(address, { signer });

        const handleConfirm = () =>
          signAndSend({
            api,
            alert,
            signer,
            address,
            isReply: true,
            reject,
            resolve,
          });

        showModal<TransactionModalProps>(TransactionModal, {
          fee: partialFee.toHuman(),
          name: TransactionName.SendReply,
          addressTo: reply.replyToId,
          addressFrom: account.address,
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
