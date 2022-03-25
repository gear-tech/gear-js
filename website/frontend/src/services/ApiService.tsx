import { ReactNode } from 'react';
import { AlertOptions } from 'react-alert';
import { UploadProgramModel, Message, Reply, MetaModel, ProgramStatus } from 'types/program';
import { web3FromSource } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { CreateType, GearKeyring, GearMessage, GearMessageReply, Metadata } from '@gear-js/api';
import { RPC_METHODS, PROGRAM_ERRORS, LOCAL_STORAGE } from 'consts';
import { AlertTypes } from 'types/alerts';
import { localPrograms } from './LocalDBService';
import { readFileAsync, signPayload, isDevChain, getLocalProgramMeta } from 'helpers';
import ServerRPCRequestService from './ServerRPCRequestService';
import { nodeApi } from 'api/initApi';

// TODO: (dispatch) fix it later

export const UploadProgram = async (
  api: any,
  account: InjectedAccountWithMeta,
  file: File,
  opts: UploadProgramModel,
  metaFile: any,
  enableLoading: () => void,
  disableLoading: () => void,
  showAlert: (message?: ReactNode, options?: AlertOptions) => void,
  callback: () => void
) => {
  const apiRequest = new ServerRPCRequestService();

  /* eslint-disable @typescript-eslint/naming-convention */
  const {
    gasLimit,
    value,
    initPayload,
    init_input,
    init_output,
    handle_input,
    handle_output,
    types,
    title,
    programName,
  } = opts;
  let name = '';

  if (programName) {
    name = programName;
  } else {
    name = file.name;
  }

  const injector = await web3FromSource(account.meta.source);

  const fileBuffer: any = await readFileAsync(file);

  const program = {
    code: new Uint8Array(fileBuffer),
    gasLimit: gasLimit.toString(),
    value: value.toString(),
    initPayload,
  };

  const meta = {
    init_input,
    init_output,
    handle_input,
    handle_output,
    types,
  };

  try {
    const { programId } = await api.program.submit(program, meta);

    await api.program.signAndSend(account.address, { signer: injector.signer }, (data: any) => {
      enableLoading();

      if (data.status.isInBlock) {
        showAlert('Upload program: In block', { type: AlertTypes.SUCCESS });
      }

      if (data.status.isFinalized) {
        data.events.forEach((event: any) => {
          const { method } = event.event;

          if (method === 'InitMessageEnqueued') {
            showAlert('Upload program: Finalized', { type: AlertTypes.SUCCESS });
            disableLoading();
            callback();

            if (isDevChain()) {
              localPrograms
                .setItem(programId, {
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
                  showAlert('Program added to the localDB successfully', { type: AlertTypes.SUCCESS });
                })
                .catch((error: any) => {
                  showAlert(`Error: ${error}`, { type: AlertTypes.ERROR });
                });
            } else {
              // Sign metadata and save it
              signPayload(injector, account.address, JSON.stringify(meta), async (signature: string) => {
                try {
                  const response = await apiRequest.getResource(RPC_METHODS.ADD_METADATA, {
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
                    showAlert('Metadata saved successfully', { type: AlertTypes.SUCCESS });
                  }
                } catch (error) {
                  showAlert(`${error}`, { type: AlertTypes.ERROR });
                  console.error(error);
                }
              });
            }
          }

          if (method === 'ExtrinsicFailed') {
            showAlert('Upload program: Extrinsic Failed', { type: AlertTypes.ERROR });
          }
        });
      }

      if (data.status.isInvalid) {
        disableLoading();
        showAlert(PROGRAM_ERRORS.INVALID_TRANSACTION, { type: AlertTypes.ERROR });
      }
    });
  } catch (error) {
    disableLoading();
    showAlert(`Upload program: ${error}`, { type: AlertTypes.ERROR });
  }
};

// TODO: (dispatch) fix it later
export const sendMessage = async (
  api: GearMessage | GearMessageReply,
  account: InjectedAccountWithMeta,
  message: Message & Reply,
  enableLoading: () => void,
  disableLoading: () => void,
  showAlert: (message?: ReactNode, options?: AlertOptions) => void,
  callback: () => void,
  meta?: Metadata
) => {
  try {
    const { signer } = await web3FromSource(account.meta.source);

    await api.submit(message, meta);
    await api.signAndSend(account.address, { signer }, (data: any) => {
      enableLoading();

      if (data.status.isInBlock) {
        showAlert('Send message: In block', { type: AlertTypes.SUCCESS });
      }

      if (data.status.isFinalized) {
        data.events.forEach((event: any) => {
          const { method } = event.event;

          if (method === 'DispatchMessageEnqueued') {
            showAlert('Send message: Finalized', { type: AlertTypes.SUCCESS });
            disableLoading();
            callback();
          }

          if (method === 'ExtrinsicFailed') {
            showAlert('Extrinsic Failed', { type: AlertTypes.ERROR });
          }
        });
      }

      if (data.status.isInvalid) {
        disableLoading();
        showAlert(PROGRAM_ERRORS.INVALID_TRANSACTION, { type: AlertTypes.ERROR });
      }
    });
  } catch (error) {
    showAlert(`Send message: ${error}`, { type: AlertTypes.ERROR });
    disableLoading();
  }
};

// TODO: (dispatch) fix it later
export const addMetadata = async (
  meta: MetaModel,
  metaFile: any,
  account: InjectedAccountWithMeta,
  programId: string,
  name: any,
  showAlert: (message?: ReactNode, options?: AlertOptions) => void
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
            showAlert('Metadata added successfully', { type: AlertTypes.SUCCESS });
          });
        })
        .catch((error) => {
          showAlert(`Error: ${error}`, { type: AlertTypes.ERROR });
        });
    } else {
      try {
        const response = await apiRequest.getResource(RPC_METHODS.ADD_METADATA, {
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
          showAlert('Metadata added successfully', { type: AlertTypes.SUCCESS });
        }
      } catch (error) {
        showAlert(`${error}`, { type: AlertTypes.ERROR });
        console.error(error);
      }
    }
  });
};

export const subscribeToEvents = (showAlert: (message?: ReactNode, options?: AlertOptions) => void) => {
  const filterKey = localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW);
  nodeApi.subscribeToProgramEvents(({ method, data: { info, reason } }) => {
    // @ts-ignore
    if (info.origin.toHex() === filterKey) {
      showAlert(`${method}\n ${info.programId.toHex()}`, { type: reason ? AlertTypes.ERROR : AlertTypes.SUCCESS });
    }
  });

  nodeApi.subscribeToLogEvents(async ({ data: { source, dest, reply, payload } }) => {
    let meta = null;
    let decodedPayload: any;
    const programId = source.toHex();
    const apiRequest = new ServerRPCRequestService();

    const { result } = isDevChain()
      ? await getLocalProgramMeta(programId)
      : await apiRequest.getResource(RPC_METHODS.GET_METADATA, { programId });

    if (result && result.meta) {
      meta = JSON.parse(result.meta);
    } else {
      showAlert('Metadata is not added', { type: AlertTypes.ERROR });
    }

    try {
      decodedPayload =
        meta.output && !(reply.isSome && reply.unwrap()[1].toNumber() !== 0)
          ? CreateType.decode(meta.output, payload, meta).toHuman()
          : payload.toHuman();
    } catch (error) {
      console.error('Decode payload failed');
    }
    // @ts-ignore
    if (dest.toHex() === filterKey) {
      // TODO: add payload parsing
      const msg = `LOG from program\n ${source.toHex()}\n ${decodedPayload ? `Response: ${decodedPayload}` : ''}`;
      const options = {
        type:
          (reply.isSome && reply.unwrap()[1].toNumber() === 0) || reply.isNone ? AlertTypes.SUCCESS : AlertTypes.ERROR,
      };

      showAlert(msg, options);
    }
  });

  nodeApi.subscribeToTransferEvents(({ data: { from, to, value } }) => {
    if (to.toHex() === filterKey) {
      const msg = `TRANSFER BALANCE\n FROM:${GearKeyring.encodeAddress(from.toHex())}\n VALUE:${value.toString()}`;
      showAlert(msg, { type: AlertTypes.INFO });
    }
  });
};
