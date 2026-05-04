import type { ProgramMetadata } from '@gear-js/api';
import type { HexString } from '@polkadot/util/types';

type ParamsToUploadCode = {
  optBuffer: Buffer;
  name: string;
  voucherId: string;
  metadata: {
    hash: HexString | null | undefined;
    hex: HexString | undefined;
    value: ProgramMetadata | undefined;
    isFromStorage: boolean;
  };
  sails: {
    idl: string | undefined;
    isFromStorage: boolean;
  };
  resolve: () => void;
};

export type { ParamsToUploadCode };
