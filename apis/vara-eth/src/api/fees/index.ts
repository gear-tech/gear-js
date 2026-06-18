import type { EthereumClient } from '../../eth/index.js';
import { estimateFee, type FeeEstimate, type WalletOp } from './estimate.js';

export type { FeeEstimate, WalletOp } from './estimate.js';
export { estimateFee } from './estimate.js';

/**
 * Convenience namespace attached to {@link VaraEthApi} as `api.fees`.
 */
export class FeesNamespace {
  constructor(private readonly _ethClient: EthereumClient) {}

  /**
   * See {@link estimateFee}.
   */
  estimate(op: WalletOp): Promise<FeeEstimate> {
    return estimateFee(this._ethClient, op);
  }
}
