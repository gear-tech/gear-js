import { HexString } from '@polkadot/util/types';

import { OperationCallbacks } from '@/entities/hooks';

type ParamsToUploadMeta = Partial<OperationCallbacks> & {
  programId: HexString;
  codeHash: HexString;
  metaHex: HexString;
  name?: string;
};

export type { ParamsToUploadMeta };
