import { HexString } from '@polkadot/util/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';

import { ParamsToSignAndSend as CommonParamsToSignAndSend } from '@/entities/hooks';

type ParamsToUploadCode = {
  optBuffer: Buffer;
  name: string;
  voucherId: string;
  metaHex: HexString | undefined;
  idl: string | undefined;
  resolve: () => void;
};

type ParamsToSignAndSend = Omit<CommonParamsToSignAndSend, 'reject'> & {
  extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>;
  name: string;
  codeId: HexString;
  metaHex: HexString | undefined;
  idl: string | undefined;
};

export type { ParamsToUploadCode, ParamsToSignAndSend };
