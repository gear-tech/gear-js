import { AddressOrPair, Signer } from '@polkadot/api/types';
import { GearApi, Hex } from '@gear-js/api';
import { AlertContainerFactory } from '@gear-js/react-hooks';

import { OperationCallbacks } from 'types/hooks';

export type ClaimMessageParams = OperationCallbacks & {
  messageId: Hex;
};

export type SignAndSendArg = OperationCallbacks & {
  api: GearApi;
  alert: AlertContainerFactory;
  signer: Signer;
  address: AddressOrPair;
};
