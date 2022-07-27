import { useCallback } from 'react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useApi, useAccount, useAlert } from '@gear-js/react-hooks';

import { useModal } from '../index';
import { UploadProgramParams } from './types';
import { signAndUpload } from './helpers';

import { readFileAsync } from 'helpers';
import { ACCOUNT_ERRORS, TransactionName } from 'consts';
import { UploadProgramModel } from 'types/program';
import { TransactionModal, TransactionModalProps } from 'components/modals/TransactionModal';

const useProgramUpload = () => {
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();
  const { showModal } = useModal();

  const submit = async (file: File, programModel: UploadProgramModel) => {
    const fileBuffer = (await readFileAsync(file)) as ArrayBufferLike;

    const { gasLimit, value, initPayload, meta, payloadType } = programModel;

    const program = {
      code: new Uint8Array(fileBuffer),
      gasLimit: gasLimit.toString(),
      value: value.toString(),
      initPayload,
    };

    const result = await api.program.upload(program, meta, payloadType);

    return result.programId;
  };

  const uploadProgram = useCallback(
    async ({ file, programModel, metadataBuffer, reject, resolve }: UploadProgramParams) => {
      if (!account) {
        alert.error(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED);

        return;
      }

      const { meta, address } = account;

      try {
        const [programId, { signer }] = await Promise.all([submit(file, programModel), web3FromSource(meta.source)]);

        const { partialFee } = await api.program.paymentInfo(address, { signer });

        const handleConfirm = () =>
          signAndUpload({
            api,
            file,
            alert,
            signer,
            account,
            programId,
            metadataBuffer,
            programModel,
            reject,
            resolve,
          });

        showModal<TransactionModalProps>(TransactionModal, {
          fee: partialFee.toHuman(),
          name: TransactionName.SubmitProgram,
          addressFrom: account.address,
          onCancel: reject,
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

  return uploadProgram;
};

export { useProgramUpload };
