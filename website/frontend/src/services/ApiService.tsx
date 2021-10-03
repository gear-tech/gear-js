import { GearKeyring } from '@gear-js/api';
import { u8aToHex } from '@polkadot/util';
import { UploadProgramModel, MessageModel } from 'types/program';
import { GEAR_STORAGE_KEY, RPC_METHODS } from 'consts';
import { sendMessageSuccessAction, sendMessageFailedAction, programStatusAction, sendMessageResetAction } from 'store/actions/actions';
import { readFileAsync } from '../helpers';
import ServerRPCRequestService from './ServerRPCRequestService';

export const UploadProgram = async (api: any, file: File, opts: UploadProgramModel) => {
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
      if (data.status === 'Finalized') {
        console.log('Finalized!');
        // Send sing message
        const signature = u8aToHex(GearKeyring.sign(keyring, JSON.stringify(meta)));

        apiRequest.getResource(
          RPC_METHODS.ADD_METADATA,
          {
            meta: JSON.stringify(meta),
            signature,
            programId,
            name: filename,
            title,
          },
          { Authorization: `Bearer ${localStorage.getItem(GEAR_STORAGE_KEY)}` }
        );
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export const SendMessageToProgram = async (api: any, message: MessageModel, dispatch: any) => {
  const apiRequest = new ServerRPCRequestService();

  const jsonKeyring: any = localStorage.getItem('gear_mnemonic');
  const keyring = GearKeyring.fromJson(jsonKeyring);

  try {
    // get metadata for specific program
    const {
      result: { meta },
    } = await apiRequest.getResource(
      RPC_METHODS.GET_METADATA,
      {
        programId: message.destination,
      },
      { Authorization: `Bearer ${localStorage.getItem(GEAR_STORAGE_KEY)}` }
    );

    await api.message.submit(message, meta);
    await api.message.signAndSend(keyring, (data: any) => {

      programStatusAction(data.status);

      if(data.status === 'Finalized'){
        console.log('Finalized!');
        dispatch(sendMessageSuccessAction());
        dispatch(sendMessageResetAction());
      }
    });
  } catch (error) {
    dispatch(sendMessageFailedAction(`${error}`))
    console.error(error);
  }
};
