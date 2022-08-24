import { Hex } from '@gear-js/api';

import { ParamsToSignAndSend as CommonParamsToSignAndSend } from 'entities/hooks';

type ParamsToUploadCode = {
  file: File;
};

type ParamsToSignAndSend = Omit<CommonParamsToSignAndSend, 'reject' | 'resolve'> & {
  codeHash: Hex;
};

export type { ParamsToUploadCode, ParamsToSignAndSend };
