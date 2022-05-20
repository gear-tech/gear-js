import { Event } from '@polkadot/types/interfaces';
import { web3FromSource } from '@polkadot/extension-dapp';

import { PROGRAM_ERRORS } from 'consts';
import { useApi, useAccount, useAlert } from 'hooks';
import { readFileAsync } from 'helpers';
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
    if (!account) {
      alert.error('Wallet not connected');

      return;
    }

    const { address, meta } = account;

    const alertTitle = 'gear.submitCode';
    const alertId = alert.loading('SignIn', { title: alertTitle });

    try {
      const { signer } = await web3FromSource(meta.source);
      const { codeHash } = await submit(file);

      await api.code.signAndSend(address, { signer }, ({ events, status }) => {
        if (status.isReady) {
          alert.update(alertId, 'Ready');

          return;
        }

        if (status.isInBlock) {
          alert.update(alertId, 'InBlock');

          events.forEach(({ event }) => {
            const { method, section } = event;

            if (method === 'CodeSaved') {
              alert.success(<CopiedInfo title="Code hash" info={codeHash} />, {
                title: `${section}.CodeSaved`,
                timeout: 0,
              });

              return;
            }

            if (method === 'ExtrinsicFailed') {
              alert.error(getErrorMessage(event), { title: `${section}.ExtrinsicFailed` });

              return;
            }
          });

          return;
        }

        if (status.isFinalized) {
          alert.update(alertId, 'Finalized', DEFAULT_SUCCESS_OPTIONS);

          return;
        }

        if (status.isInvalid) {
          alert.update(alertId, PROGRAM_ERRORS.INVALID_TRANSACTION, DEFAULT_ERROR_OPTIONS);
        }
      });
    } catch (error) {
      alert.update(alertId, `${error}`, DEFAULT_ERROR_OPTIONS);
      console.error(error);
    }
  };

  return uploadCode;
};

export { useCodeUpload };
