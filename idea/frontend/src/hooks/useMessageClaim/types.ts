import { Hex } from '@gear-js/api';

import { OperationCallbacks } from 'entities/hooks';

type ParamsToClaimMessage = OperationCallbacks & {
  messageId: Hex;
};

export type { ParamsToClaimMessage };
