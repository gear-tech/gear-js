import { Hex } from '@gear-js/api';

import { OperationCallbacks } from 'types/hooks';

export type ClaimMessageParams = OperationCallbacks & {
  messageId: Hex;
};
