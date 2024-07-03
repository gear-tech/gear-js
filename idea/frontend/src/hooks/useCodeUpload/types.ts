import { HexString } from '@polkadot/util/types';

type ParamsToUploadCode = {
  optBuffer: Buffer;
  name: string;
  voucherId: string;
  metaHex: HexString | undefined;
  idl: string | undefined;
  resolve: () => void;
};

export type { ParamsToUploadCode };
