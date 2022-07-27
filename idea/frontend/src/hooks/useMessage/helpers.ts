import { DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from '@gear-js/react-hooks';

import { SignAndSendArg } from './types';

import { getExtrinsicFailedMessage } from 'helpers';
import { PROGRAM_ERRORS, TransactionStatus, TransactionName } from 'consts';
import { Method } from 'types/explorer';

export const signAndSend = async ({
  api,
  alert,
  signer,
  address,
  isReply = false,
  reject,
  resolve,
}: SignAndSendArg) => {
  const alertId = alert.loading('SignIn', {
    title: isReply ? TransactionName.SendReply : TransactionName.SendMessage,
  });

  const apiExtrinsic = isReply ? api.reply : api.message;

  try {
    await apiExtrinsic.signAndSend(address, { signer }, (data) => {
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

    reject();
    alert.update(alertId, message, DEFAULT_ERROR_OPTIONS);
  }
};
