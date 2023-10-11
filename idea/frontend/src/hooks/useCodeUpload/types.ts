import { HexString } from '@polkadot/util/types';

import { ParamsToSignAndSend as CommonParamsToSignAndSend } from '@/entities/hooks';

type ParamsToUploadCode = {
  optBuffer: Buffer;
  name: string;
  metaHex: HexString | undefined;
  resolve: () => void;
};

type ParamsToSignAndSend = Omit<CommonParamsToSignAndSend, 'reject'> & {
  name: string;
  codeId: HexString;
  metaHex: HexString | undefined;
};

export type { ParamsToUploadCode, ParamsToSignAndSend };
