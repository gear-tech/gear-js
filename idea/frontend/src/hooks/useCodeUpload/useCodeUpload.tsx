import { useCallback } from 'react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useApi, useAlert, useAccount, DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from '@gear-js/react-hooks';

import { useModal } from '../index';
import { UploadCodeParams, SignAndSendArg } from './types';

import { readFileAsync, getExtrinsicFailedMessage } from 'helpers';
import { PROGRAM_ERRORS, ACCOUNT_ERRORS, TransactionName, TransactionStatus } from 'consts';
import { Method } from 'types/explorer';
import { CopiedInfo } from 'components/common/CopiedInfo';
import { TransactionModal, TransactionModalProps } from 'components/modals/TransactionModal';

const useCodeUpload = () => {
  const { api } = useApi();
  const alert = useAlert();
  const { account } = useAccount();
  const { showModal } = useModal();

  const submit = async (file: File) => {
    const arrayBuffer = (await readFileAsync(file)) as ArrayBuffer;
    const buffer = Buffer.from(arrayBuffer);

    const result = await api.code.upload(buffer);

    return result.codeHash;
  };

  const signAndSend = async ({ signer, codeHash }: SignAndSendArg) => {
    const alertId = alert.loading('SignIn', { title: TransactionName.SubmitCode });

    try {
      await api.code.signAndSend(account!.address, { signer }, ({ events, status }) => {
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

  const uploadCode = useCallback(
    async ({ file }: UploadCodeParams) => {
      try {
        if (!account) {
          throw new Error(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED);
        }

        const { address, meta } = account;

        const [codeHash, { signer }] = await Promise.all([submit(file), web3FromSource(meta.source)]);

        const { partialFee } = await api.code.paymentInfo(address, { signer });

        const handleConfirm = () =>
          signAndSend({
            signer,
            codeHash,
          });

        showModal<TransactionModalProps>(TransactionModal, {
          fee: partialFee.toHuman(),
          name: TransactionName.SubmitCode,
          addressFrom: address,
          onConfirm: handleConfirm,
        });
      } catch (error) {
        const message = (error as Error).message;

        alert.error(message);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, account]
  );

  return uploadCode;
};

export { useCodeUpload };
