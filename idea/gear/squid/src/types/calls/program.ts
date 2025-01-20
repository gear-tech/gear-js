import { HexString } from '@gear-js/api';

import { Calls } from '../../common';
import { Call } from '../../processor';

export interface AUploadProgram {
  code: HexString;
  salt: string;
  initPayload: string;
  gasLimit: string;
  value: string;
}

export interface ACreateProgram extends Omit<AUploadProgram, 'code'> {
  codeId: string;
}

export type CUploadProgram = Omit<Call, 'args'> & { args: AUploadProgram };
export type CCreateProgram = Omit<Call, 'args'> & { args: ACreateProgram };

export const isUploadProgram = (obj: any): obj is CUploadProgram => obj.name === Calls.UploadProgram;
export const isCreateProgram = (obj: any): obj is CCreateProgram => obj.name === Calls.CreateProgram;
