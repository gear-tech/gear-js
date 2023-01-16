import { Hex } from '@gear-js/api';

import { OperationCallbacks } from 'entities/hooks';

type ParamsToUploadMeta = Partial<OperationCallbacks> & {
  name: string;
  programId: string;
  metaHex: Hex;
};

export type { ParamsToUploadMeta };
