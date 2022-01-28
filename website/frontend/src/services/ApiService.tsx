import { UploadProgramModel, MessageModel, MetaModel, ProgramStatus } from 'types/program';
import { web3FromSource } from '@polkadot/extension-dapp';
import { GearApi, Metadata } from '@gear-js/api';
import { UserAccount } from 'types/account';
import { RPC_METHODS, PROGRAM_ERRORS } from 'consts';
import { EventTypes } from 'types/events';
import {
  programUploadStartAction,
  sendMessageSuccessAction,
  sendMessageStartAction,
  sendMessageFailedAction,
  programUploadSuccessAction,
  programUploadFailedAction,
  AddAlert,
} from 'store/actions/actions';
import { localPrograms } from './LocalDBService';
import { readFileAsync, signPayload, isDevChain } from 'helpers';
import ServerRPCRequestService from './ServerRPCRequestService';

// TODO: (dispatch) fix it later

export const UploadProgram = async (
  api: any,
  account: UserAccount,
  file: File,
  opts: UploadProgramModel,
  metaFile: any,
  dispatch: any,
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
    gasLimit,
    value,
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
    const programId = await api.program.submit(program, meta);

    await api.program.signAndSend(account.address, { signer: injector.signer }, (data: any) => {
      dispatch(programUploadStartAction());

      if (data.status.isInBlock) {
        dispatch(
          AddAlert({
            type: EventTypes.SUCCESS,
            message: `Upload program: In block`,
          })
        );
      }

      if (data.status.isFinalized) {
        data.events.forEach((event: any) => {
          const { method } = event.event;

          if (method === 'InitMessageEnqueued') {
            dispatch(
              AddAlert({
                type: EventTypes.SUCCESS,
                message: `Upload program: Finalized`,
              })
            );
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
                  uploadedAt: Date(),
                })
                .then(() => {
                  dispatch(
                    AddAlert({ type: EventTypes.SUCCESS, message: `Program added to the localDB successfully` })
                  );
                })
                .catch((error: any) => {
                  dispatch(AddAlert({ type: EventTypes.ERROR, message: `Error: ${error}` }));
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
                    dispatch(AddAlert({ type: EventTypes.SUCCESS, message: `Metadata saved successfully` }));
                  }
                } catch (error) {
                  dispatch(AddAlert({ type: EventTypes.ERROR, message: `${error}` }));
                  console.error(error);
                }
              });
            }
          }

          if (method === 'ExtrinsicFailed') {
            dispatch(
              AddAlert({
                type: EventTypes.ERROR,
                message: `Upload program: Extrinsic Failed`,
              })
            );
          }
        });
      }

      if (data.status.isInvalid) {
        dispatch(programUploadFailedAction(PROGRAM_ERRORS.INVALID_TRANSACTION));
        dispatch(
          AddAlert({
            type: EventTypes.ERROR,
            message: PROGRAM_ERRORS.INVALID_TRANSACTION,
          })
        );
      }
    });
  } catch (error) {
    dispatch(programUploadFailedAction(`${error}`));
    dispatch(AddAlert({ type: EventTypes.ERROR, message: `Upload program: ${error}` }));
  }
};

// TODO: (dispatch) fix it later
export const SendMessageToProgram = async (
  api: GearApi,
  account: UserAccount,
  message: MessageModel,
  dispatch: any,
  callback: () => void,
  meta?: Metadata
) => {
  const injector = await web3FromSource(account.meta.source);

  try {
    await api.message.submit(message, meta);
    await api.message.signAndSend(account.address, { signer: injector.signer }, (data: any) => {
      dispatch(sendMessageStartAction());

      if (data.status.isInBlock) {
        dispatch(
          AddAlert({
            type: EventTypes.SUCCESS,
            message: `Send message: In block`,
          })
        );
      }

      if (data.status.isFinalized) {
        data.events.forEach((event: any) => {
          const { method } = event.event;

          if (method === 'DispatchMessageEnqueued') {
            dispatch(
              AddAlert({
                type: EventTypes.SUCCESS,
                message: `Send message: Finalized`,
              })
            );
            dispatch(sendMessageSuccessAction());
            callback();
          }

          if (method === 'ExtrinsicFailed') {
            dispatch(
              AddAlert({
                type: EventTypes.ERROR,
                message: `Extrinsic Failed`,
              })
            );
          }
        });
      }

      if (data.status.isInvalid) {
        dispatch(sendMessageFailedAction(PROGRAM_ERRORS.INVALID_TRANSACTION));
        dispatch(
          AddAlert({
            type: EventTypes.ERROR,
            message: PROGRAM_ERRORS.INVALID_TRANSACTION,
          })
        );
      }
    });
  } catch (error) {
    dispatch(AddAlert({ type: EventTypes.ERROR, message: `Send message: ${error}` }));
    dispatch(sendMessageFailedAction(`${error}`));
  }
};

// TODO: (dispatch) fix it later
export const addMetadata = async (
  meta: MetaModel,
  metaFile: any,
  account: UserAccount,
  programId: string,
  name: any,
  dispatch: any
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
            dispatch(AddAlert({ type: EventTypes.SUCCESS, message: `Metadata added successfully` }));
          });
        })
        .catch((error) => {
          dispatch(AddAlert({ type: EventTypes.ERROR, message: `Error: ${error}` }));
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
          dispatch(AddAlert({ type: EventTypes.SUCCESS, message: `Metadata added successfully` }));
        }
      } catch (error) {
        dispatch(AddAlert({ type: EventTypes.ERROR, message: `${error}` }));
        console.error(error);
      }
    }
  });
};
