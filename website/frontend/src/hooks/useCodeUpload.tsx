import { Event } from '@polkadot/types/interfaces';
import { web3FromSource } from '@polkadot/extension-dapp';

import { PROGRAM_ERRORS, TransactionStatus } from 'consts';
import { useApi, useAccount, useAlert } from 'hooks';
import { readFileAsync } from 'helpers';
import { Method } from 'types/explorer';
import { DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from 'context/alert/const';
import { CopiedInfo } from 'components/common/CopiedInfo';

const useCodeUpload = () => {
  const { api } = useApi();
  const alert = useAlert();
  const { account } = useAccount();

  const submit = async (file: File) => {
    const arrayBuffer = (await readFileAsync(file)) as ArrayBuffer;
    const buffer = Buffer.from(arrayBuffer);

    return api.code.submit(buffer);
  };

  const getErrorMessage = (event: Event) => {
    const { docs, method: errorMethod } = api.getExtrinsicFailedError(event);
    const formattedDocs = docs.filter(Boolean).join('. ');

    return `${errorMethod}: ${formattedDocs}`;
  };

  const uploadCode = async (file: File) => {
    try {
      if (!account) {
        throw new Error('Wallet not connected');
      }

      const { address, meta } = account;

      const alertId = alert.loading('SignIn', { title: 'gear.submitCode' });

      const { signer } = await web3FromSource(meta.source);
      const { codeHash } = await submit(file);

      await api.code
        .signAndSend(address, { signer }, ({ events, status }) => {
          if (status.isReady) {
            alert.update(alertId, TransactionStatus.Ready);

            return;
          }

          if (status.isInBlock) {
            alert.update(alertId, TransactionStatus.InBlock);

            events.forEach(({ event }) => {
              const { method, section } = event;

              const eventTitle = `${section}.${method}`;

              if (method === Method.CodeSaved) {
                alert.success(<CopiedInfo title="Code hash" info={codeHash} />, {
                  title: eventTitle,
                });

                return;
              }

              if (method === Method.ExtrinsicFailed) {
                alert.error(getErrorMessage(event), { title: eventTitle });

                return;
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
        })
        .catch((error) => {
          alert.update(alertId, error.message, DEFAULT_ERROR_OPTIONS);
        });
    } catch (error) {
      alert.error((error as Error).message);
    }
  };

  return uploadCode;
};

export { useCodeUpload };
