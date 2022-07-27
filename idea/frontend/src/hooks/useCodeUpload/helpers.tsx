import { DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from '@gear-js/react-hooks';

import { SignAndSendArg } from './types';

import { getExtrinsicFailedMessage } from 'helpers';
import { PROGRAM_ERRORS, TransactionName, TransactionStatus } from 'consts';
import { Method } from 'types/explorer';
import { CopiedInfo } from 'components/common/CopiedInfo';

export const signAndSend = async ({ api, alert, signer, address, codeHash }: SignAndSendArg) => {
  const alertId = alert.loading('SignIn', { title: TransactionName.SubmitCode });

  try {
    await api.code.signAndSend(address, { signer }, ({ events, status }) => {
      if (status.isReady) {
        alert.update(alertId, TransactionStatus.Ready);

        return;
      }

      if (status.isInBlock) {
        alert.update(alertId, TransactionStatus.InBlock);

        events.forEach(({ event }) => {
          const { method, section } = event;

          const alertOptions = { title: `${section}.${method}` };

          if (method === Method.ExtrinsicFailed) {
            alert.error(getExtrinsicFailedMessage(api, event), alertOptions);

            return;
          }

          if (method === Method.CodeSaved) {
            alert.success(<CopiedInfo title="Code hash" info={codeHash} />, alertOptions);
          }
        });

        return;
      }

      if (status.isFinalized) {
        alert.update(alertId, TransactionStatus.Finalized, DEFAULT_SUCCESS_OPTIONS);

        return;
      }

      if (status.isInvalid) {
        alert.update(alertId, PROGRAM_ERRORS.INVALID_TRANSACTION, DEFAULT_ERROR_OPTIONS);
      }
    });
  } catch (error) {
    const message = (error as Error).message;

    alert.update(alertId, message, DEFAULT_ERROR_OPTIONS);
  }
};
