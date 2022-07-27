import { Hex } from '@gear-js/api';

import { OperationCallbacks, SignAndSendArg as CommonSignAndSendArg } from 'types/hooks';

export type UploadCodeParams = Partial<OperationCallbacks> & {
  file: File;
};

export type SignAndSendArg = Omit<CommonSignAndSendArg, 'reject' | 'resolve'> & {
  codeHash: Hex;
};
