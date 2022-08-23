import { Hex } from '@gear-js/api';

import { OperationCallbacks } from 'shared/types/hooks';

export type ParamsToClaimMessage = OperationCallbacks & {
  messageId: Hex;
};
