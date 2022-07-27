import { useCallback } from 'react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useApi, useAccount, useAlert } from '@gear-js/react-hooks';

import { useModal } from '../index';
import { ClaimMessageParams } from './types';
import { signAndSend } from './helpers';

import { ACCOUNT_ERRORS, TransactionName } from 'consts';
import { TransactionModal, TransactionModalProps } from 'components/modals/TransactionModal';

const useMessageClaim = () => {
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();
  const { showModal } = useModal();

  const claimMessage = useCallback(
    async ({ messageId, reject, resolve }: ClaimMessageParams) => {
      if (!account) {
        alert.error(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED);

        return;
      }

      const { meta, address } = account;

      try {
        api.claimValueFromMailbox.submit(messageId);

        const { signer } = await web3FromSource(meta.source);
        // @ts-ignore
        const { partialFee } = await api.claimValueFromMailbox.paymentInfo(address, { signer });

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
          name: TransactionName.ClaimMessage,
          addressTo: messageId,
          addressFrom: address,
          onCancel: reject,
          onConfirm: handleConfirm,
        });
      } catch (error) {
        const message = (error as Error).message;

        alert.error(message);
        reject();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, account]
  );

  return claimMessage;
};

export { useMessageClaim };
