import { HexString } from '@polkadot/util/types';

import { OperationCallbacks } from 'entities/hooks';

type ParamsToUploadMeta = Partial<OperationCallbacks> & {
  name?: string;
  codeHash: string;
  metaHex: HexString;
};

export type { ParamsToUploadMeta };
