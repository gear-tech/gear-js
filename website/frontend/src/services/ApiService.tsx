import { GearKeyring } from '@gear-js/api';
import { UploadProgramModel } from 'types/program';
import { RPC_METHODS } from 'consts';
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

  console.log(program);
  console.log(meta);

  try {
    // Submit program, recive program ID
    const programId = await api.program.submit(program, meta);
    // Trying to sign tansaction, recive
    await api.program.signAndSend(keyring, (data: any) => {
      if (data.status === 'Finalized') {
        console.log('Finalized!');
        // Send sing message
        const signature = GearKeyring.sign(keyring, JSON.stringify(meta));

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
    console.error(error);
  }
};

