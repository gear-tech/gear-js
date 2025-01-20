import { HexString } from '@polkadot/util/types';

import { OperationCallbacks } from '@/entities/hooks';

type ParamsToClaimMessage = OperationCallbacks & {
  messageId: HexString;
};

export type { ParamsToClaimMessage };
