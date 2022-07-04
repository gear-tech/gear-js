/* eslint-disable import/no-cycle */
import { useCallback } from 'react';
import { generatePath } from 'react-router-dom';
import { web3FromSource } from '@polkadot/extension-dapp';

import { useApi, useAccount, useAlert } from '../index';
import { waitForProgramInit } from './helpers';

import { routes } from 'routes';
import { PROGRAM_ERRORS, TransactionStatus } from 'consts';
import { readFileAsync, getExtrinsicFailedMessage } from 'helpers';
import { uploadMetadata } from 'services/ApiService';
import { DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from 'context/alert/const';
import { Method } from 'types/explorer';
import { UploadProgramModel, ProgramStatus } from 'types/program';
import { CustomLink } from 'components/common/CustomLink';

const useProgramUpload = () => {
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();

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

    return api.program.submit(program, meta, payloadType);
  };

  const uploadProgram = useCallback(
    async (file: File, programModel: UploadProgramModel, metaBuffer: string | null, callback: () => void) => {
      if (!account) {
        alert.error('Wallet not connected');

        return;
      }

      const alertId = alert.loading('SignIn', { title: 'gear.submitProgram' });

      try {
        const injector = await web3FromSource(account.meta.source);

        const { programId } = await submit(file, programModel);

        const initialization = waitForProgramInit(api, programId);

        const signStatus = await api.program
          .signAndSend(account.address, { signer: injector.signer }, (data) => {
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

                  return;
                }

                if (method === Method.MessageEnqueued) {
                  alert.success('Success', alertOptions);

                  callback();
                }
              });

              return;
            }

            if (data.status.isInvalid) {
              alert.update(alertId, PROGRAM_ERRORS.INVALID_TRANSACTION, DEFAULT_ERROR_OPTIONS);
            }
          })
          .then(() => ProgramStatus.Success)
          .catch(() => ProgramStatus.Failed);

        if (signStatus === ProgramStatus.Failed) {
          alert.update(alertId, 'Cancelled', DEFAULT_ERROR_OPTIONS);

          return;
        }

        const initStatus = await initialization;

        const programMessage = getProgramMessage(programId);
        const programAlertOptions = { title: 'Program initialization' };

        if (initStatus === ProgramStatus.Failed) {
          alert.error(programMessage, programAlertOptions);

          return;
        }

        const { meta, title, programName } = programModel;

        if (meta && metaBuffer) {
          const name = programName ?? file.name;

          await uploadMetadata(programId, account, name, injector, alert, metaBuffer, meta, title);
        }

        alert.success(programMessage, programAlertOptions);
      } catch (error) {
        alert.error((error as Error).message);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, account]
  );

  return uploadProgram;
};

export { useProgramUpload };
