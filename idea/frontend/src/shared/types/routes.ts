import { HexString } from '@polkadot/util/types';

type PathParams = {
  programId: HexString;
};

type StateWithFile = {
  file?: File;
};

export type { StateWithFile, PathParams };
