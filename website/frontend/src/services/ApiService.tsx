import { UploadProgramModel, MessageModel, MetaModel } from 'types/program';
import { web3FromSource } from '@polkadot/extension-dapp';
import { UserAccount } from 'types/account';
import { RPC_METHODS } from 'consts';
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
import { readFileAsync, signPayload } from '../helpers';
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
    // Submit program, receive program ID
    const programId = await api.program.submit(program, meta);

    // Trying to sign transaction, receive
    await api.program.signAndSend(account.address, { signer: injector.signer }, (data: any) => {
      dispatch(programUploadStartAction());
      dispatch(AddAlert({ type: EventTypes.SUCCESS, message: `UPLOAD STATUS: ${data.status}` }));
      if (data.status === 'Finalized') {
        dispatch(programUploadSuccessAction());
        callback();

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
              throw new Error(response.error.message);
            } else {
              dispatch(AddAlert({ type: EventTypes.SUCCESS, message: `Metadata added successfully` }));
            }
          } catch (error) {
            dispatch(AddAlert({ type: EventTypes.ERROR, message: `${error}` }));
            console.error(error);
          }
        });
      }
    });
  } catch (error) {
    dispatch(programUploadFailedAction(`${error}`));
    console.error(error);
    dispatch(AddAlert({ type: EventTypes.ERROR, message: `UPLOAD STATUS: ${error}` }));
    // alert.error(`status: ${error}`);
  }
};

// TODO: (dispatch) fix it later
export const SendMessageToProgram = async (
  api: any,
  account: UserAccount,
  message: MessageModel,
  dispatch: any,
  callback: () => void
) => {
  const apiRequest = new ServerRPCRequestService();

  const injector = await web3FromSource(account.meta.source);

  try {
    // get metadata for specific program
    const {
      result: { meta },
    } = await apiRequest.getResource(RPC_METHODS.GET_METADATA, {
      programId: message.destination,
    });
    await api.message.submit(message, JSON.parse(meta));
    await api.message.signAndSend(account.address, { signer: injector.signer }, (data: any) => {
      dispatch(sendMessageStartAction());
      dispatch(AddAlert({ type: EventTypes.SUCCESS, message: `SEND MESSAGE STATUS: ${data.status}` }));
      if (data.status === 'Finalized') {
        console.log('Finalized!');
        dispatch(sendMessageSuccessAction());
        callback();
      }
    });
  } catch (error) {
    dispatch(AddAlert({ type: EventTypes.ERROR, message: `SEND MESSAGE STATUS: ${error}` }));
    dispatch(sendMessageFailedAction(`${error}`));
    console.error(error);
  }
};

// TODO: (dispatch) fix it later
export const addMetadata = async (
  meta: MetaModel,
  account: UserAccount,
  programHash: string,
  name: any,
  dispatch: any
) => {
  const apiRequest = new ServerRPCRequestService();
  const injector = await web3FromSource(account.meta.source);

  // Sign metadata and save it
  signPayload(injector, account.address, JSON.stringify(meta), async (signature: string) => {
    try {
      const response = await apiRequest.getResource(RPC_METHODS.ADD_METADATA, {
        meta: JSON.stringify(meta),
        signature,
        programId: programHash,
        name,
        title: meta.title,
      });

      if (response.error) {
        throw new Error(response.error.message);
      } else {
        dispatch(AddAlert({ type: EventTypes.SUCCESS, message: `Metadata added successfully` }));
      }
    } catch (error) {
      dispatch(AddAlert({ type: EventTypes.ERROR, message: `${error}` }));
      console.error(error);
    }
  });
};
