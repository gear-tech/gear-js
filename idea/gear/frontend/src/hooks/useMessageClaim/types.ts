import type { HexString } from '@polkadot/util/types';

import type { OperationCallbacks } from '@/entities/hooks';

type ParamsToClaimMessage = OperationCallbacks & {
  messageId: HexString;
};

export type { ParamsToClaimMessage };
