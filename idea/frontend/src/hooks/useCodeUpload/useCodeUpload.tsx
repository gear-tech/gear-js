import { useCallback } from 'react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useApi, useAlert, useAccount } from '@gear-js/react-hooks';

import { useModal } from '../index';
import { UploadCodeParams } from './types';
import { signAndSend } from './helpers';

import { readFileAsync } from 'helpers';
import { ACCOUNT_ERRORS, TransactionName } from 'consts';
import { TransactionModal, TransactionModalProps } from 'components/modals/TransactionModal';

const useCodeUpload = () => {
  const { api } = useApi();
  const alert = useAlert();
  const { account } = useAccount();
  const { showModal } = useModal();

  const submit = async (file: File) => {
    const arrayBuffer = (await readFileAsync(file)) as ArrayBuffer;
    const buffer = Buffer.from(arrayBuffer);

    return api.code.submit(buffer);
  };

  const uploadCode = useCallback(
    async ({ file }: UploadCodeParams) => {
      if (!account) {
        alert.error(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED);

        return;
      }

      const { address, meta } = account;

      try {
        const { codeHash } = await submit(file);

        const { signer } = await web3FromSource(meta.source);
        // @ts-ignore
        const { partialFee } = await api.code.paymentInfo(address, { signer });

        const handleConfirm = () =>
          signAndSend({
            api,
            alert,
            signer,
            address,
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
