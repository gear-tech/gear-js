import { generatePath } from 'react-router-dom';
import { UnsubscribePromise } from '@polkadot/api/types';
import { GearApi, Hex, MessageEnqueued, MessagesDispatched, ProgramChanged } from '@gear-js/api';
import { DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from '@gear-js/react-hooks';

import { SignAndUploadArg } from './types';

import { routes } from 'routes';
import { PROGRAM_ERRORS, TransactionName, TransactionStatus } from 'consts';
import { getExtrinsicFailedMessage } from 'helpers';
import { uploadMetadata } from 'services/ApiService';
import { Method } from 'types/explorer';
import { ProgramStatus } from 'types/program';
import { CustomLink } from 'components/common/CustomLink';

const getProgramMessage = (programId: string) => (
  <p>
    ID: <CustomLink to={generatePath(routes.program, { programId })} text={programId} />
  </p>
);

const waitForProgramInit = (api: GearApi, programId: string) => {
  let messageId: Hex;
  let unsubPromise: UnsubscribePromise;

  const unsubscribe = async () => (await unsubPromise)();

  return new Promise<string>((resolve) => {
    unsubPromise = api.query.system.events((events) => {
      events.forEach(({ event }) => {
        switch (event.method) {
          case Method.MessageEnqueued: {
            const meEvent = event as MessageEnqueued;

            if (meEvent.data.destination.eq(programId) && meEvent.data.entry.isInit) {
              messageId = meEvent.data.id.toHex();
            }

            break;
          }
          case Method.MessagesDispatched: {
            const mdEvent = event as MessagesDispatched;

            for (const [id, status] of mdEvent.data.statuses) {
              if (id.eq(messageId) && status.isFailed) {
                resolve(ProgramStatus.Failed);
              }
            }

            break;
          }
          case Method.ProgramChanged: {
            const pcEvent = event as ProgramChanged;

            if (pcEvent.data.id.eq(programId) && pcEvent.data.change.isActive) {
              resolve(ProgramStatus.Success);
            }

            break;
          }
          default:
            break;
        }
      });
    });
  }).finally(unsubscribe);
};

export const signAndUpload = async ({
  api,
  file,
  alert,
  signer,
  account,
  programId,
  programModel,
  metadataBuffer,
  reject,
  resolve,
}: SignAndUploadArg) => {
  const alertId = alert.loading('SignIn', { title: TransactionName.SubmitProgram });

  try {
    const initialization = waitForProgramInit(api, programId);

    await api.program.signAndSend(account.address, { signer }, (data) => {
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
            reject();

            return;
          }

          if (method === Method.MessageEnqueued) {
            alert.success('Success', alertOptions);

            resolve();
          }
        });

        return;
      }

      if (data.status.isInvalid) {
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

    const { meta, title, programName } = programModel;

    if (meta && metadataBuffer) {
      const name = programName ?? file.name;

      await uploadMetadata(programId, account, name, signer, alert, metadataBuffer, meta, title).catch((error) =>
        alert.error(error.message)
      );
    }

    alert.success(programMessage, alertOptions);
  } catch (error) {
    const message = (error as Error).message;

    alert.update(alertId, message, DEFAULT_ERROR_OPTIONS);
    reject();
  }
};
