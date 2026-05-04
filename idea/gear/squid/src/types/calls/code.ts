import type { HexString } from '@gear-js/api';

import { Calls } from '../../common';
import type { Call } from '../../processor';

export interface AUploadCode {
  code: HexString;
}

export type CUploadCode = Omit<Call, 'args'> & { args: AUploadCode };

export const isUploadCode = (obj: any): obj is CUploadCode => obj.name === Calls.UploadCode;
