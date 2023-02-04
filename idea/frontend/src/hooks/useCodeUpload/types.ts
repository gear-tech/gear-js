import { HexString } from '@polkadot/util/types';

import { ParamsToSignAndSend as CommonParamsToSignAndSend } from 'entities/hooks';

type ParamsToUploadCode = {
  file: File;
};

type ParamsToSignAndSend = Omit<CommonParamsToSignAndSend, 'reject' | 'resolve'> & {
  codeHash: HexString;
};

export type { ParamsToUploadCode, ParamsToSignAndSend };
