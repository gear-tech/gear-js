import { Signer } from '@polkadot/api/types';

type OperationCallbacks = {
  reject: () => void;
  resolve: () => void;
};

type ParamsToSignAndSend = Required<OperationCallbacks> & {
  signer: Signer;
};

export type { OperationCallbacks, ParamsToSignAndSend };
