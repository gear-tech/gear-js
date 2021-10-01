import { GearKeyring } from '@gear-js/api';
import { UploadProgramModel } from 'types/program';
import { readFileAsync } from '../helpers';

export const UploadProgram = async (api: any, file: File, opts: UploadProgramModel) => {
  /* eslint-disable @typescript-eslint/naming-convention */
  const { gasLimit, value, initPayload, init_input, init_output, input, output, types } = opts;
  //   const filename = file.name;
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
    const programId = await api.program.submit(program, meta);
    console.log(programId);
  } catch (error) {
    console.error(error);
  }

  try {
    await api.program.signAndSend(keyring, (data: any) => {
      console.log(data);
    });
  } catch (error) {
    console.error(error);
  }
};
