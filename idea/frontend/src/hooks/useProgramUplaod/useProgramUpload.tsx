import { useCallback } from 'react';
import { generatePath } from 'react-router-dom';
import { EventRecord } from '@polkadot/types/interfaces';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useApi, useAccount, useAlert, DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from '@gear-js/react-hooks';

import { useModal } from '../index';
import { useMetadataUplaod } from '../useMetadataUpload';
import { UploadProgramParams, SignAndUploadArg } from './types';
import { waitForProgramInit } from './helpers';

import { routes } from 'routes';
import { readFileAsync, getExtrinsicFailedMessage } from 'helpers';
import { PROGRAM_ERRORS, ACCOUNT_ERRORS, TransactionName, TransactionStatus } from 'consts';
import { Method } from 'types/explorer';
import { UploadProgramModel, ProgramStatus } from 'types/program';
import { OperationCallbacks } from 'types/hooks';
import { CustomLink } from 'components/common/CustomLink';
import { TransactionModal, TransactionModalProps } from 'components/modals/TransactionModal';

const useProgramUpload = () => {
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();

  const { showModal } = useModal();
  const uploadMetadata = useMetadataUplaod();

  const getProgramMessage = (programId: string) => (
    <p>
      ID: <CustomLink to={generatePath(routes.program, { programId })} text={programId} />
    </p>
  );

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

  const handleEventsStatus = (events: EventRecord[], { reject, resolve }: OperationCallbacks) => {
    events.forEach(({ event }) => {
      const { method, section } = event;
      const alertOptions = { title: `${section}.${method}` };

      if (method === Method.ExtrinsicFailed) {
        alert.error(getExtrinsicFailedMessage(api, event), alertOptions);
        reject();
      } else if (method === Method.MessageEnqueued) {
        alert.success('Success', alertOptions);
        resolve();
      }
    });
  };

  const signAndUpload = async ({
    file,
    signer,
    programId,
    programModel,
    metadataBuffer,
    reject,
    resolve,
  }: SignAndUploadArg) => {
    const alertId = alert.loading('SignIn', { title: TransactionName.SubmitProgram });

    try {
      const initialization = waitForProgramInit(api, programId);

      await api.program.signAndSend(account!.address, { signer }, ({ status, events }) => {
        if (status.isReady) {
          alert.update(alertId, TransactionStatus.Ready);
        } else if (status.isInBlock) {
          alert.update(alertId, TransactionStatus.InBlock);
        } else if (status.isFinalized) {
          alert.update(alertId, TransactionStatus.Finalized, DEFAULT_SUCCESS_OPTIONS);
          handleEventsStatus(events, { reject, resolve });
        } else if (status.isInvalid) {
          alert.update(alertId, PROGRAM_ERRORS.INVALID_TRANSACTION, DEFAULT_ERROR_OPTIONS);
          reject();
        }
      });

      const initStatus = await initialization;

      const alertOptions = { title: 'Program initialization' };
      const programMessage = getProgramMessage(programId);

      if (initStatus === ProgramStatus.Failed) {
        alert.error(programMessage, alertOptions);
        reject();

        return;
      }

      const { meta: metadata, title, programName } = programModel;

      if (metadata && metadataBuffer) {
        uploadMetadata({
          name: programName ?? file.name,
          title,
          signer,
          metadata,
          programId,
          metadataBuffer,
          resolve: () => alert.success(programMessage, alertOptions),
        });
      }
    } catch (error) {
      const message = (error as Error).message;

      alert.update(alertId, message, DEFAULT_ERROR_OPTIONS);
      reject();
    }
  };

  const uploadProgram = useCallback(
    async ({ file, programModel, metadataBuffer, reject, resolve }: UploadProgramParams) => {
      try {
        if (!account) {
          throw new Error(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED);
        }

        const { meta, address } = account;

        const [programId, { signer }] = await Promise.all([submit(file, programModel), web3FromSource(meta.source)]);

        const { partialFee } = await api.program.paymentInfo(address, { signer });

        const handleConfirm = () =>
          signAndUpload({
            file,
            signer,
            programId,
            metadataBuffer,
            programModel,
            reject,
            resolve,
          });

        showModal<TransactionModalProps>(TransactionModal, {
          fee: partialFee.toHuman(),
          name: TransactionName.SubmitProgram,
          addressFrom: address,
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
    [api, account, uploadMetadata]
  );

  return uploadProgram;
};

export { useProgramUpload };
