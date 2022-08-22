import { web3FromSource } from '@polkadot/extension-dapp';
import { useApi, useAccount, useAlert, DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from '@gear-js/react-hooks';
import { GearApi, Hex, MessageEnqueued, MessagesDispatched, Metadata } from '@gear-js/api';
import { UnsubscribePromise } from '@polkadot/api/types';
import { Event } from '@polkadot/types/interfaces';
import { InitPayload } from 'types';
import { useSupplyChainOpt, useSupplyChainMeta } from './api';

enum ProgramStatus {
  Success = 'success',
  Failed = 'failed',
  InProgress = 'in progress',
}

export interface UploadProgramModel {
  id?: string;
  meta?: Metadata;
  value: number;
  title?: string;
  gasLimit: number;
  initPayload: string;
  programName?: string;
  payloadType?: string;
}

enum TransactionStatus {
  Ready = 'Ready',
  InBlock = 'InBlock',
  IsInvalid = 'IsInvalid',
  Finalized = 'Finalized',
}

const PROGRAM_ERRORS = {
  UNAUTHORIZED: 'Unauthorized',
  INVALID_PARAMS: 'Invalid method parameters',
  INVALID_TRANSACTION: 'Transaction error. Status: isInvalid',
  PROGRAM_INIT_FAILED: 'Program initialization failed',
  GEAR_NODE_ERROR: 'Gear node error',
  BALANCE_LOW: 'Invalid transaction. Account balance too low',
  PAYLOAD_ERROR: 'payload.toHex is not a function',
};

const getExtrinsicFailedMessage = (api: GearApi, event: Event) => {
  const { docs, method } = api.getExtrinsicFailedError(event);
  const formattedDocs = docs.filter(Boolean).join('. ');

  return `${method}: ${formattedDocs}`;
};

const waitForProgramInit = (api: GearApi, programId: string) => {
  let messageId: Hex;
  let unsubPromise: UnsubscribePromise;

  const unsubscribe = async () => (await unsubPromise)();

  return new Promise<string>((resolve) => {
    unsubPromise = api.query.system.events((events) => {
      events.forEach(({ event }) => {
        switch (event.method) {
          case 'MessageEnqueued': {
            const meEvent = event as MessageEnqueued;

            if (meEvent.data.destination.eq(programId) && meEvent.data.entry.isInit) {
              messageId = meEvent.data.id.toHex();
            }

            break;
          }

          case 'MessagesDispatched': {
            const mdEvent = event as MessagesDispatched;
            mdEvent.data.statuses.forEach(({ isFailed, isSuccess }, id) => {
              if (id.eq(messageId)) {
                if (isFailed) resolve(ProgramStatus.Failed);
                if (isSuccess) resolve(ProgramStatus.Success);
              }
            });

            break;
          }

          default:
            break;
        }
      });
    });
  }).finally(unsubscribe);
};

function useSupplyChainUpload(onSuccess: (programId: Hex) => void) {
  const { api } = useApi();
  const { account } = useAccount();
  const alert = useAlert();

  const { uintArray, buffer } = useSupplyChainOpt();
  const { metadata } = useSupplyChainMeta();

  const uploadProgram = async (initPayload: InitPayload) => {
    if (!account || !buffer || !uintArray || !metadata) return;

    try {
      const { decodedAddress } = account;
      const value = 0;

      const gas = await api.program.calculateGas.initUpload(
        decodedAddress,
        buffer,
        initPayload,
        value,
        false,
        metadata,
      );
      const gasLimit = gas.min_limit;

      const alertId = alert.loading('SignIn', { title: 'gear.uploadProgram' });

      const { signer } = await web3FromSource(account.meta.source);

      const program = { code: uintArray, gasLimit: gasLimit.toString(), value: value.toString(), initPayload };
      const { programId } = await api.program.upload(program, metadata, undefined);

      const initialization = waitForProgramInit(api, programId);

      const signStatus = await api.program
        .signAndSend(account.address, { signer }, ({ status, events }) => {
          if (status.isReady) {
            alert.update(alertId, TransactionStatus.Ready);

            return;
          }

          if (status.isInBlock) {
            alert.update(alertId, TransactionStatus.InBlock);

            return;
          }

          if (status.isFinalized) {
            alert.update(alertId, TransactionStatus.Finalized, DEFAULT_SUCCESS_OPTIONS);

            events.forEach(({ event }) => {
              const { method, section } = event;

              const alertOptions = { title: `${section}.${method}` };

              if (method === 'ExtrinsicFailed') {
                alert.error(getExtrinsicFailedMessage(api, event), alertOptions);

                return;
              }

              if (method === 'MessageEnqueued') {
                alert.success('Success', alertOptions);

                onSuccess(programId);
              }
            });

            return;
          }

          if (status.isInvalid) {
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

      const programAlertOptions = { title: 'Program initialization' };

      if (initStatus === ProgramStatus.Failed) {
        alert.error(programId, programAlertOptions);

        return;
      }

      alert.success(programId, programAlertOptions);
    } catch (error) {
      alert.error((error as Error).message);
    }
  };

  return uploadProgram;
}

export { useSupplyChainUpload };
