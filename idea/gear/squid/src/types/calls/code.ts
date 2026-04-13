import type { HexString } from '@gear-js/api';

import { Calls } from '../../common/index.js';
import type { Call } from '../../processor.js';

export interface AUploadCode {
  code: HexString;
}

export type CUploadCode = Omit<Call, 'args'> & { args: AUploadCode };

export const isUploadCode = (obj: any): obj is CUploadCode => obj.name === Calls.UploadCode;
