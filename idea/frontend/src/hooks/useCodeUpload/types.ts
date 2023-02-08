import { HexString } from '@polkadot/util/types';

import { ParamsToSignAndSend as CommonParamsToSignAndSend } from 'entities/hooks';

type ParamsToUploadCode = {
  file: File;
  name: string;
  metaHex: HexString;
  resolve: () => void;
};

type ParamsToSignAndSend = Omit<CommonParamsToSignAndSend, 'reject'> & {
  name: string;
  codeId: HexString;
  metaHex: HexString;
};

export type { ParamsToUploadCode, ParamsToSignAndSend };
