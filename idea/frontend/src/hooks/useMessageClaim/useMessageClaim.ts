import { useCallback } from 'react';
import { EventRecord } from '@polkadot/types/interfaces';
import { web3FromSource } from '@polkadot/extension-dapp';
import { UserMessageRead } from '@gear-js/api';
import { useApi, useAccount, useAlert, DEFAULT_SUCCESS_OPTIONS, DEFAULT_ERROR_OPTIONS } from '@gear-js/react-hooks';

import { useModal } from '../index';
import { ClaimMessageParams } from './types';

import { ACCOUNT_ERRORS, PROGRAM_ERRORS, TransactionName, TransactionStatus } from 'consts';
import { getExtrinsicFailedMessage } from 'helpers';
import { Method } from 'types/explorer';
import { SignAndSendArg, OperationCallbacks } from 'types/hooks';

const useMessageClaim = () => {
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();
  const { showModal } = useModal();

  const handleEventsStatus = (events: EventRecord[], reject: OperationCallbacks['resolve']) => {
    events.forEach(({ event }) => {
      const { method, section, data } = event as UserMessageRead;
      const alertOptions = { title: `${section}.${method}` };

      if (method === Method.UserMessageRead) {
        const reason = data.reason.toHuman() as { [key: string]: string };
        const reasonKey = Object.keys(reason)[0];
        const reasonValue = reason[reasonKey];

        const message = `${data.id.toHuman()}\n ${reasonKey}: ${reasonValue}`;

        alert.success(message, alertOptions);
      } else if (method === Method.ExtrinsicFailed) {
        alert.error(getExtrinsicFailedMessage(api, event), alertOptions);
        reject();
      }
    });
  };

  const signAndSend = async ({ signer, reject, resolve }: SignAndSendArg) => {
    const alertId = alert.loading('SignIn', { title: TransactionName.ClaimMessage });

    try {
      await api.claimValueFromMailbox.signAndSend(account!.address, { signer }, ({ status, events }) => {
        if (status.isReady) {
          alert.update(alertId, TransactionStatus.Ready);
        } else if (status.isInBlock) {
          alert.update(alertId, TransactionStatus.InBlock);
          handleEventsStatus(events, reject);
        } else if (status.isFinalized) {
          alert.update(alertId, TransactionStatus.Finalized, DEFAULT_SUCCESS_OPTIONS);
          resolve();
        } else if (status.isInvalid) {
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

  const claimMessage = useCallback(
    async ({ messageId, reject, resolve }: ClaimMessageParams) => {
      try {
        if (!account) {
          throw new Error(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED);
        }

        const { meta, address } = account;

        api.claimValueFromMailbox.submit(messageId);

        const { signer } = await web3FromSource(meta.source);
        const { partialFee } = await api.claimValueFromMailbox.paymentInfo(address, { signer });

        const handleConfirm = () =>
          signAndSend({
            signer,
            reject,
            resolve,
          });

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
        reject();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, account]
  );

  return claimMessage;
};

export { useMessageClaim };
