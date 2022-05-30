import { AlertContainerFactory } from 'context/alert/types';
import { UploadProgramModel, Message, Reply, ProgramStatus } from 'types/program';
import { web3FromSource } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { CreateType, GearApi, GearKeyring, GearMessage, GearMessageReply, Metadata } from '@gear-js/api';
import { RPC_METHODS, PROGRAM_ERRORS, LOCAL_STORAGE, EVENT_TYPES } from 'consts';
import { localPrograms } from './LocalDBService';
import { readFileAsync, signPayload, isDevChain, getLocalProgramMeta } from 'helpers';
import ServerRPCRequestService from './ServerRPCRequestService';
import { nodeApi } from 'api/initApi';
import { GetMetaResponse } from 'api/responses';
import { DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from 'context/alert/const';

// TODO: (dispatch) fix it later

export const UploadProgram = async (
  api: GearApi,
  account: InjectedAccountWithMeta,
  file: File,
  programModel: UploadProgramModel,
  metaFile: any,
  alert: AlertContainerFactory,
  callback: () => void
) => {
  const apiRequest = new ServerRPCRequestService();
  const { gasLimit, value, initPayload, meta, title, programName } = programModel;

  /* eslint-disable @typescript-eslint/naming-convention */
  let name = '';

  if (programName) {
    name = programName;
  } else {
    name = file.name;
  }

  const injector = await web3FromSource(account.meta.source);

  const fileBuffer: any = await readFileAsync(file);

  const program: any /* `any` should be removed when it becomes possible to specify type of the code as Uint8Array (next update of @gear-js/api)*/ =
    {
      code: new Uint8Array(fileBuffer),
      gasLimit: gasLimit.toString(),
      value: value.toString(),
      initPayload,
    };

  const alertTitle = 'gear.submitProgram';

  const alertId = alert.loading('SignIn', { title: alertTitle });

  try {
    const { programId } = api.program.submit(program, meta);

    await api.program.signAndSend(account.address, { signer: injector.signer }, (data) => {
      if (data.status.isReady) {
        alert.update(alertId, 'Ready');

        return;
      }

      if (data.status.isInBlock) {
        alert.update(alertId, 'InBlock');

        return;
      }

      if (data.status.isFinalized) {
        alert.update(alertId, 'Finalized', DEFAULT_SUCCESS_OPTIONS);

        data.events.forEach(({ event: { method } }) => {
          if (method === 'InitMessageEnqueued') {
            callback();

            if (isDevChain()) {
              localPrograms
                .setItem(programId as string /* the same */, {
                  id: programId,
                  name,
                  title,
                  initStatus: ProgramStatus.Success,
                  meta: {
                    meta: JSON.stringify(meta),
                    metaFile,
                    programId,
                  },
                  timestamp: Date(),
                })
                .then(() => {
                  alert.success('Program added to the localDB successfully');
                })
                .catch((error: any) => {
                  alert.error(`Error: ${error}`);
                });
            } else {
              // Sign metadata and save it
              signPayload(injector, account.address, JSON.stringify(meta), async (signature: string) => {
                try {
                  const response = await apiRequest.callRPC(RPC_METHODS.ADD_METADATA, {
                    meta: JSON.stringify(meta),
                    signature,
                    programId,
                    name,
                    title,
                    metaFile,
                  });

                  if (response.error) {
                    // FIXME 'throw' of exception caught locally
                    throw new Error(response.error.message);
                  } else {
                    alert.success('Metadata saved successfully');
                  }
                } catch (error) {
                  alert.error(`${error}`);
                  console.error(error);
                }
              });
            }
          }

          if (method === 'ExtrinsicFailed') {
            alert.error('Extrinsic Failed', {
              title: alertTitle,
            });
          }
        });

        return;
      }

      if (data.status.isInvalid) {
        alert.update(alertId, PROGRAM_ERRORS.INVALID_TRANSACTION, DEFAULT_ERROR_OPTIONS);
      }
    });
  } catch (error) {
    alert.update(alertId, `${error}`, DEFAULT_ERROR_OPTIONS);
  }
};

// TODO: (dispatch) fix it later
export const sendMessage = async (
  api: GearMessage | GearMessageReply,
  account: InjectedAccountWithMeta,
  message: Message & Reply,
  alert: AlertContainerFactory,
  callback: () => void,
  meta?: Metadata,
  payloadType?: string
) => {
  const alertTitle = 'gear.sendMessage';

  const alertId = alert.loading('SignIn', { title: alertTitle });

  try {
    const { signer } = await web3FromSource(account.meta.source);

    api.submit(message, meta, payloadType);

    await api.signAndSend(account.address, { signer }, (data) => {
      if (data.status.isReady) {
        alert.update(alertId, 'Ready');

        return;
      }

      if (data.status.isInBlock) {
        alert.update(alertId, 'InBlock');

        return;
      }

      if (data.status.isFinalized) {
        alert.update(alertId, 'Finalized', DEFAULT_SUCCESS_OPTIONS);

        data.events.forEach(({ event }) => {
          const { method, section } = event;

          if (method === 'DispatchMessageEnqueued') {
            alert.success('Success', { title: `${section}.DispatchMessageEnqueued` });
            callback();

            return;
          }

          if (method === 'ExtrinsicFailed') {
            alert.error('Extrinsic Failed', { title: alertTitle });
          }
        });

        return;
      }

      if (data.status.isInvalid) {
        alert.update(alertId, PROGRAM_ERRORS.INVALID_TRANSACTION, DEFAULT_ERROR_OPTIONS);
      }
    });
  } catch (error) {
    alert.update(alertId, `${error}`, DEFAULT_ERROR_OPTIONS);
  }
};

// TODO: (dispatch) fix it later
export const addMetadata = async (
  meta: Metadata,
  metaFile: any,
  account: InjectedAccountWithMeta,
  programId: string,
  name: any,
  alert: AlertContainerFactory
) => {
  const apiRequest = new ServerRPCRequestService();
  const injector = await web3FromSource(account.meta.source);

  // Sign metadata and save it
  signPayload(injector, account.address, JSON.stringify(meta), async (signature: string) => {
    if (isDevChain()) {
      localPrograms
        .getItem(programId)
        .then((res: any) => {
          const newData = {
            ...res,
            meta: {
              meta: JSON.stringify(meta),
              metaFile,
              programId,
            },
            title: meta.title,
          };

          localPrograms.setItem(res.id, newData).then(() => {
            alert.success('Metadata added successfully');
          });
        })
        .catch((error) => {
          alert.error(`Error: ${error}`);
        });
    } else {
      try {
        const response = await apiRequest.callRPC(RPC_METHODS.ADD_METADATA, {
          meta: JSON.stringify(meta),
          signature,
          programId,
          name,
          title: meta.title,
          metaFile,
        });

        if (response.error) {
          // FIXME 'throw' of exception caught locally
          throw new Error(response.error.message);
        } else {
          alert.success('Metadata added successfully');
        }
      } catch (error) {
        alert.error(`${error}`);
        console.error(error);
      }
    }
  });
};

export const subscribeToEvents = (alert: AlertContainerFactory) => {
  const filterKey = localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW);

  nodeApi.subscribeToProgramEvents(({ method, data: { info, reason } }) => {
    // @ts-ignore
    if (info.origin.toHex() === filterKey) {
      const isInitFailure = method === EVENT_TYPES.PROGRAM_INITIALIZATION_FAILURE;
      const initFailureReason = reason?.isDispatch && reason?.asDispatch.toHuman();
      const methodString = initFailureReason && isInitFailure ? `${method}: ${initFailureReason}` : `${method}`;
      const programId = info.programId.toHex();
      const message = `${methodString}\n${programId}`;
      const showAlert = reason ? alert.error : alert.success;

      showAlert(message);
    }
  });

  nodeApi.subscribeToLogEvents(async ({ data: { source, destination, reply, payload } }) => {
    if (destination.toHex() === filterKey) {
      let meta = null;
      let decodedPayload: any;
      const programId = source.toHex();
      const apiRequest = new ServerRPCRequestService();

      const { result } = isDevChain()
        ? await getLocalProgramMeta(programId)
        : await apiRequest.callRPC<GetMetaResponse>(RPC_METHODS.GET_METADATA, { programId });

      if (result && result.meta) {
        meta = JSON.parse(result.meta);
      }

      try {
        decodedPayload =
          meta.output && !(reply.isSome && reply.unwrap()[1].toNumber() !== 0)
            ? CreateType.decode(meta.output, payload, meta).toHuman()
            : payload.toHuman();
      } catch (error) {
        console.error('Decode payload failed');
      }

      // TODO: add payload parsing
      const message = `LOG from program\n ${source.toHex()}\n ${decodedPayload ? `Response: ${decodedPayload}` : ''}`;
      const isSuccess = (reply.isSome && reply.unwrap()[1].toNumber() === 0) || reply.isNone;
      const showAlert = isSuccess ? alert.success : alert.error;

      showAlert(message);
    }
  });

  nodeApi.subscribeToTransferEvents(({ data: { from, to, value } }) => {
    if (to.toHex() === filterKey) {
      const message = `TRANSFER BALANCE\n FROM:${GearKeyring.encodeAddress(from.toHex())}\n VALUE:${value.toString()}`;
      alert.info(message);
    }
  });
};
