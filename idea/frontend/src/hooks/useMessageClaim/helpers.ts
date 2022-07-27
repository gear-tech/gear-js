import { UserMessageRead } from '@gear-js/api';
import { DEFAULT_SUCCESS_OPTIONS, DEFAULT_ERROR_OPTIONS } from '@gear-js/react-hooks';

import { SignAndSendArg } from './types';

import { getExtrinsicFailedMessage } from 'helpers';
import { PROGRAM_ERRORS, TransactionName, TransactionStatus } from 'consts';
import { Method } from 'types/explorer';

export const signAndSend = async ({ api, alert, signer, address, reject, resolve }: SignAndSendArg) => {
  const alertId = alert.loading('SignIn', { title: TransactionName.ClaimMessage });

  try {
    await api.claimValueFromMailbox.signAndSend(address, { signer }, ({ status, events }) => {
      if (status.isReady) {
        alert.update(alertId, TransactionStatus.Ready);

        return;
      }

      if (status.isInBlock) {
        alert.update(alertId, TransactionStatus.InBlock);

        events.forEach(({ event }) => {
          const { method, section, data } = event as UserMessageRead;

          const alertOptions = { title: `${section}.${method}` };

          if (method === Method.UserMessageRead) {
            const reason = data.reason.toHuman() as { [key: string]: string };
            const reasonKey = Object.keys(reason)[0];
            const reasonValue = reason[reasonKey];

            const message = `${data.id.toHuman()}\n ${reasonKey}: ${reasonValue}`;

            alert.success(message, alertOptions);

            return;
          }

          if (method === Method.ExtrinsicFailed) {
            alert.error(getExtrinsicFailedMessage(api, event), alertOptions);
            reject();

            return;
          }
        });

        return;
      }

      if (status.isFinalized) {
        alert.update(alertId, TransactionStatus.Finalized, DEFAULT_SUCCESS_OPTIONS);
        resolve();

        return;
      }

      if (status.isInvalid) {
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
