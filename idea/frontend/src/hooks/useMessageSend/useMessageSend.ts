import { useCallback } from 'react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useAccount, useApi, useAlert } from '@gear-js/react-hooks';

import { useModal } from '../index';
import { signAndSend } from './helpers';
import { SendMessageParams } from './types';

import { ACCOUNT_ERRORS, TransactionName } from 'consts';
import { TransactionModal, TransactionModalProps } from 'components/modals/TransactionModal';

const useSendMessage = () => {
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();
  const { showModal } = useModal();

  const sendMessage = useCallback(
    async ({ metadata, message, extrinsic, payloadType, reject, resolve }: SendMessageParams) => {
      if (!account) {
        alert.error(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED);

        return;
      }

      const { meta, address } = account;

      const isReply = extrinsic === 'handle';
      const apiExtrinsic = isReply ? api.reply : api.message;
      const transactionName = isReply ? TransactionName.SendReply : TransactionName.SendMessage;

      try {
        // TODO: fix message type
        apiExtrinsic.submit(message as any, metadata, payloadType);

        const { signer } = await web3FromSource(meta.source);
        // @ts-ignore
        const { partialFee } = await apiExtrinsic.paymentInfo(address, { signer });

        const handleConfirm = () =>
          signAndSend({
            api,
            alert,
            signer,
            address,
            apiExtrinsic,
            transactionName,
            reject,
            resolve,
          });

        showModal<TransactionModalProps>(TransactionModal, {
          fee: partialFee.toHuman(),
          name: transactionName,
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

  return sendMessage;
};

export { useSendMessage };
