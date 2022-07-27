import { AddressOrPair, Signer } from '@polkadot/api/types';
import { GearApi } from '@gear-js/api';
import { AlertContainerFactory } from '@gear-js/react-hooks';

export type OperationCallbacks = {
  reject: () => void;
  resolve: () => void;
};

export type SignAndSendArg = Required<OperationCallbacks> & {
  api: GearApi;
  alert: AlertContainerFactory;
  signer: Signer;
  address: AddressOrPair;
};
