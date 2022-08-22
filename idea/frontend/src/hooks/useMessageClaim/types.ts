import { Hex } from '@gear-js/api';

import { OperationCallbacks } from 'types/hooks';

export type ParamsToClaimMessage = OperationCallbacks & {
  messageId: Hex;
};
