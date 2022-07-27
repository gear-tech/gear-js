import { web3FromSource } from '@polkadot/extension-dapp';
import { useApi, useAccount, useAlert, DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from '@gear-js/react-hooks';

import { readFileAsync, getExtrinsicFailedMessage } from 'helpers';
import { ACCOUNT_ERRORS, PROGRAM_ERRORS, TransactionName, TransactionStatus } from 'consts';
import { Method } from 'types/explorer';
import { CopiedInfo } from 'components/common/CopiedInfo';

const useCodeUpload = () => {
  const { api } = useApi();
  const alert = useAlert();
  const { account } = useAccount();

  const submit = async (file: File) => {
    const arrayBuffer = (await readFileAsync(file)) as ArrayBuffer;
    const buffer = Buffer.from(arrayBuffer);

    return api.code.upload(buffer);
  };

  const uploadCode = async (file: File) => {
    if (!account) {
      alert.error(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED);

      return;
    }

    const alertId = alert.loading('SignIn', { title: TransactionName.SubmitCode });

    try {
      const { address, meta } = account;

      const { signer } = await web3FromSource(meta.source);
      const { codeHash } = await submit(file);

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

  return uploadCode;
};

export { useCodeUpload };
