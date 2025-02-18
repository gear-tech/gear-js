import { UserMessageRead } from '@gear-js/api';
import { useApi, useAccount, useAlert, DEFAULT_SUCCESS_OPTIONS, DEFAULT_ERROR_OPTIONS } from '@gear-js/react-hooks';
import { EventRecord } from '@polkadot/types/interfaces';
import { useCallback } from 'react';

import { OperationCallbacks } from '@/entities/hooks';
import { Method } from '@/features/explorer';
import { useModal } from '@/hooks';
import { PROGRAM_ERRORS, TransactionName, TransactionStatus } from '@/shared/config';
import { checkWallet, getExtrinsicFailedMessage } from '@/shared/helpers';

import { ParamsToClaimMessage } from './types';

const useMessageClaim = () => {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();
  const alert = useAlert();
  const { showModal } = useModal();

  const handleEventsStatus = (events: EventRecord[], reject: OperationCallbacks['resolve']) => {
    if (!isApiReady) throw new Error('API is not initialized');

    events.forEach(({ event }) => {
      const { method, section, data } = event as UserMessageRead;
      const alertOptions = { title: `${section}.${method}` };

      if (method === Method.UserMessageRead) {
        const reason = data.reason.toHuman() as { [key: string]: string };
        const reasonKey = Object.keys(reason)[0];
        const reasonValue = reason[reasonKey];

        const message = `${data.id.toHuman() as string}\n ${reasonKey}: ${reasonValue}`;

        alert.success(message, alertOptions);
      } else if (method === Method.ExtrinsicFailed) {
        alert.error(getExtrinsicFailedMessage(api, event), alertOptions);

        if (reject) reject();
      }
    });
  };

  const signAndSend = async ({ reject, resolve }: OperationCallbacks) => {
    const alertId = alert.loading('SignIn', { title: TransactionName.ClaimMessage });

    try {
      if (!isApiReady) throw new Error('API is not initialized');
      if (!account) throw new Error('Account not found');
      const { address, signer } = account;

      await api.claimValueFromMailbox.signAndSend(address, { signer }, ({ status, events }) => {
        if (status.isReady) {
          alert.update(alertId, TransactionStatus.Ready);
        } else if (status.isInBlock) {
          alert.update(alertId, TransactionStatus.InBlock);
          handleEventsStatus(events, reject);
        } else if (status.isFinalized) {
          alert.update(alertId, TransactionStatus.Finalized, DEFAULT_SUCCESS_OPTIONS);

          if (resolve) resolve();
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

  const claimMessage = useCallback(
    async ({ messageId, reject, resolve }: ParamsToClaimMessage) => {
      try {
        if (!isApiReady) throw new Error('API is not initialized');
        checkWallet(account);

        const { address, signer } = account!;

        api.claimValueFromMailbox.submit(messageId);

        const { partialFee } = await api.claimValueFromMailbox.paymentInfo(address, { signer });

        const handleConfirm = () => signAndSend({ reject, resolve });

        showModal('transaction', {
          fee: partialFee.toHuman(),
          name: TransactionName.ClaimMessage,
          addressTo: messageId,
          addressFrom: address,
          onAbort: reject,
          onConfirm: handleConfirm,
        });
      } catch (error) {
        const message = (error as Error).message;

        alert.error(message);

        if (reject) reject();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, account],
  );

  return claimMessage;
};

export { useMessageClaim };
