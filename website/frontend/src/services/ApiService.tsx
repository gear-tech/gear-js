import { ReactNode } from 'react';
import { AlertCustomOptionsWithType } from 'react-alert';
import { UploadProgramModel, MessageModel, MetaModel, ProgramStatus } from 'types/program';
import { web3FromSource } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { GearApi, Metadata } from '@gear-js/api';
import { RPC_METHODS, PROGRAM_ERRORS } from 'consts';
import { AlertTypes } from 'types/alerts';
import {
  programUploadStartAction,
  sendMessageSuccessAction,
  sendMessageStartAction,
  sendMessageFailedAction,
  programUploadSuccessAction,
  programUploadFailedAction,
} from 'store/actions/actions';
import { localPrograms } from './LocalDBService';
import { readFileAsync, signPayload, isDevChain } from 'helpers';
import ServerRPCRequestService from './ServerRPCRequestService';

// TODO: (dispatch) fix it later

export const UploadProgram = async (
  api: any,
  account: InjectedAccountWithMeta,
  file: File,
  opts: UploadProgramModel,
  metaFile: any,
  dispatch: any,
  showAlert: (message?: ReactNode, options?: AlertCustomOptionsWithType) => void,
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
      dispatch(programUploadStartAction());

      if (data.status.isInBlock) {
        showAlert('Upload program: In block', { type: AlertTypes.SUCCESS });
      }

      if (data.status.isFinalized) {
        data.events.forEach((event: any) => {
          const { method } = event.event;

          if (method === 'InitMessageEnqueued') {
            showAlert('Upload program: Finalized', { type: AlertTypes.SUCCESS });
            dispatch(programUploadSuccessAction());
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
        dispatch(programUploadFailedAction(PROGRAM_ERRORS.INVALID_TRANSACTION));
        showAlert(PROGRAM_ERRORS.INVALID_TRANSACTION, { type: AlertTypes.ERROR });
      }
    });
  } catch (error) {
    dispatch(programUploadFailedAction(`${error}`));
    showAlert(`Upload program: ${error}`, { type: AlertTypes.ERROR });
  }
};

// TODO: (dispatch) fix it later
export const SendMessageToProgram = async (
  api: GearApi,
  account: InjectedAccountWithMeta,
  _message: MessageModel,
  dispatch: any,
  showAlert: (message?: ReactNode, options?: AlertCustomOptionsWithType) => void,
  callback: () => void,
  meta?: Metadata
) => {
  const injector = await web3FromSource(account.meta.source);

  const { gasLimit, value } = _message;
  const message = {
    ..._message,
    gasLimit: gasLimit.toString(),
    value: value.toString(),
  };

  try {
    await api.message.submit(message, meta);
    await api.message.signAndSend(account.address, { signer: injector.signer }, (data: any) => {
      dispatch(sendMessageStartAction());

      if (data.status.isInBlock) {
        showAlert('Send message: In block', { type: AlertTypes.SUCCESS });
      }

      if (data.status.isFinalized) {
        data.events.forEach((event: any) => {
          const { method } = event.event;

          if (method === 'DispatchMessageEnqueued') {
            showAlert('Send message: Finalized', { type: AlertTypes.SUCCESS });
            dispatch(sendMessageSuccessAction());
            callback();
          }

          if (method === 'ExtrinsicFailed') {
            showAlert('Extrinsic Failed', { type: AlertTypes.ERROR });
          }
        });
      }

      if (data.status.isInvalid) {
        dispatch(sendMessageFailedAction(PROGRAM_ERRORS.INVALID_TRANSACTION));
        showAlert(PROGRAM_ERRORS.INVALID_TRANSACTION, { type: AlertTypes.ERROR });
      }
    });
  } catch (error) {
    showAlert(`Send message: ${error}`, { type: AlertTypes.ERROR });
    dispatch(sendMessageFailedAction(`${error}`));
  }
};

// TODO: (dispatch) fix it later
export const addMetadata = async (
  meta: MetaModel,
  metaFile: any,
  account: InjectedAccountWithMeta,
  programId: string,
  name: any,
  showAlert: (message?: ReactNode, options?: AlertCustomOptionsWithType) => void
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
