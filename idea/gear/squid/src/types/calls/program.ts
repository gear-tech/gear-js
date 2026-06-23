import type { Hex } from 'gear-idea-indexer-db';

import { Calls } from '../../common/index.js';
import type { Call } from '../../processor.js';

export interface AUploadProgram {
  code: Hex;
  salt: Hex;
  initPayload: Hex;
  gasLimit: string;
  value: string;
}

export interface ACreateProgram extends Omit<AUploadProgram, 'code'> {
  codeId: Hex;
}

export type CUploadProgram = Omit<Call, 'args'> & { args: AUploadProgram };
export type CCreateProgram = Omit<Call, 'args'> & { args: ACreateProgram };

export const isUploadProgram = (obj: any): obj is CUploadProgram => obj.name === Calls.UploadProgram;
export const isCreateProgram = (obj: any): obj is CCreateProgram => obj.name === Calls.CreateProgram;
