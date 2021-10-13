import { GearKeyring } from '@gear-js/api';
import { u8aToHex } from '@polkadot/util';
import { UploadProgramModel, MessageModel, MetaModel } from 'types/program';
import { RPC_METHODS } from 'consts';
import {
  sendMessageSuccessAction,
  sendMessageFailedAction,
  programUploadSuccessAction,
  programUploadFailedAction,
} from 'store/actions/actions';
import { readFileAsync } from '../helpers';
import ServerRPCRequestService from './ServerRPCRequestService';

export const UploadProgram = async (api: any, file: File, opts: UploadProgramModel, dispatch: any, alert: any) => {
  const apiRequest = new ServerRPCRequestService();

  /* eslint-disable @typescript-eslint/naming-convention */
  const { gasLimit, value, initPayload, init_input, init_output, input, output, types, title } = opts;
  const filename = file.name;
  const jsonKeyring: any = localStorage.getItem('gear_mnemonic');
  const keyring = GearKeyring.fromJson(jsonKeyring);

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
    input,
    output,
    types,
  };

  try {
    // Submit program, receive program ID
    const programId = await api.program.submit(program, meta);

    // Trying to sign transaction, receive
    await api.program.signAndSend(keyring, (data: any) => {
      alert.success(`status: ${data.status}`);
      if (data.status === 'Finalized') {
        dispatch(programUploadSuccessAction());
        // Send sing message
        const signature = u8aToHex(GearKeyring.sign(keyring, JSON.stringify(meta)));

        apiRequest.getResource(RPC_METHODS.ADD_METADATA, {
          meta: JSON.stringify(meta),
          signature,
          programId,
          name: filename,
          title,
        });
      }
    });
  } catch (error) {
    dispatch(programUploadFailedAction(`${error}`));
    console.error(error);
    alert.error(`status: ${error}`);
  }
};

export const SendMessageToProgram = async (api: any, message: MessageModel, dispatch: any, alert: any) => {
  const apiRequest = new ServerRPCRequestService();

  const jsonKeyring: any = localStorage.getItem('gear_mnemonic');
  const keyring = GearKeyring.fromJson(jsonKeyring);

  try {
    // get metadata for specific program
    const {
      result: { meta },
    } = await apiRequest.getResource(RPC_METHODS.GET_METADATA, {
      programId: message.destination,
    });

    await api.message.submit(message, JSON.parse(meta));
    await api.message.signAndSend(keyring, (data: any) => {
      alert.success(`status: ${data.status}`);
      if (data.status === 'Finalized') {
        console.log('Finalized!');
        dispatch(sendMessageSuccessAction());
      }
    });
  } catch (error) {
    alert.error(`status: ${error}`);
    dispatch(sendMessageFailedAction(`${error}`));
    console.error(error);
  }
};

export const addMetadata = async (meta: MetaModel, programHash: string, name: any, alert: any) => {
  const apiRequest = new ServerRPCRequestService();
  const jsonKeyring: any = localStorage.getItem('gear_mnemonic');
  const keyring = GearKeyring.fromJson(jsonKeyring);

  try {

    // Send sing message
    const signature = u8aToHex(GearKeyring.sign(keyring, JSON.stringify(meta)));

    const response = await apiRequest.getResource(RPC_METHODS.ADD_METADATA, {
      meta: JSON.stringify(meta),
      signature,
      programId: programHash,
      name,
      title: meta.title,
    });

    if(response.error) {
      throw new Error(response.error.message);
    } else {
      alert.success(`Metadata added successfully`);
    }

  } catch (error) {
    alert.error(`${error}`);
    console.error(error);
  }
}
