import { Hex } from '@gear-js/api';

import { ParamsToSignAndSend as CommonParamsToSignAndSend } from 'types/hooks';

export type ParamsToUploadCode = {
  file: File;
};

export type ParamsToSignAndSend = Omit<CommonParamsToSignAndSend, 'reject' | 'resolve'> & {
  codeHash: Hex;
};
