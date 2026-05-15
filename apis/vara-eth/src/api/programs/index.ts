import type { Address, Hex } from 'viem';

import type { EthereumClient } from '../../eth/index.js';
import type { InjectedTx } from '../injected/tx.js';
import type { IInjectedTransaction } from '../../types/index.js';
import { deployProgram, type DeployProgramOptions, type DeployProgramResult } from './deploy.js';
import { sendAndWaitForReply, type ReplyResult, type SendAndWaitOptions } from './send-and-wait.js';

export type { DeployProgramOptions, DeployProgramResult } from './deploy.js';
export type { ReplyResult, SendAndWaitOptions, SendPath } from './send-and-wait.js';
export { deployProgram } from './deploy.js';
export { sendAndWaitForReply } from './send-and-wait.js';

/**
 * Function shape required from {@link VaraEthApi.createInjectedTransaction}.
 * Decoupling via a callback keeps `ProgramsNamespace` free of a back-reference
 * to the full `VaraEthApi` instance (which would create a construction-order
 * cycle).
 */
export type CreateInjectedTransaction = (tx: IInjectedTransaction) => Promise<InjectedTx>;

/**
 * Convenience namespace attached to {@link VaraEthApi} as `api.programs`.
 *
 * Wraps the multi-step ceremonies (code upload → validation wait → deploy;
 * send → reply wait) so callers don't have to drive them by hand.
 */
export class ProgramsNamespace {
  constructor(
    private readonly _ethClient: EthereumClient,
    private readonly _createInjectedTransaction: CreateInjectedTransaction,
  ) {}

  /** See {@link deployProgram}. */
  deploy(code: Uint8Array, options: DeployProgramOptions = {}): Promise<DeployProgramResult> {
    return deployProgram(this._ethClient, code, options);
  }

  /** See {@link sendAndWaitForReply}. */
  sendAndWait(mirror: Address, payload: Hex, options: SendAndWaitOptions = {}): Promise<ReplyResult> {
    return sendAndWaitForReply(this._createInjectedTransaction, this._ethClient, mirror, payload, options);
  }
}
