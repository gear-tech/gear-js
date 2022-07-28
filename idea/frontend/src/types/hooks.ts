import { Signer } from '@polkadot/api/types';

export type OperationCallbacks = {
  reject: () => void;
  resolve: () => void;
};

export type SignAndSendArg = Required<OperationCallbacks> & {
  signer: Signer;
};
