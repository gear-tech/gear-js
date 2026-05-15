import type { Address, Hex } from 'viem';

import type { EthereumClient } from '../../eth/index.js';
import type { IVaraEthProvider, IVaraEthValidatorPoolProvider } from '../../types/index.js';
import { deployProgram, type DeployProgramOptions, type DeployProgramResult } from './deploy.js';
import { sendAndWaitForReply, type ReplyResult, type SendAndWaitOptions } from './send-and-wait.js';

export type { DeployProgramOptions, DeployProgramResult } from './deploy.js';
export type { ReplyResult, SendAndWaitOptions, SendPath } from './send-and-wait.js';
export { deployProgram } from './deploy.js';
export { sendAndWaitForReply } from './send-and-wait.js';

/**
 * Convenience namespace attached to {@link VaraEthApi} as `api.programs`.
 *
 * Wraps the multi-step ceremonies (code upload → validation wait → deploy;
 * send → reply wait) so callers don't have to drive them by hand.
 */
export class ProgramsNamespace {
  constructor(
    private readonly _provider: IVaraEthProvider | IVaraEthValidatorPoolProvider,
    private readonly _ethClient: EthereumClient,
  ) {}

  /**
   * Upload a WASM, wait for validator approval, and deploy a program from it.
   * See {@link deployProgram} for details.
   */
  deploy(code: Uint8Array, options: DeployProgramOptions = {}): Promise<DeployProgramResult> {
    return deployProgram(this._ethClient, code, options);
  }

  /**
   * Send a message to a program and wait for its reply. Supports both the
   * on-chain `Mirror.sendMessage` path and the off-chain injected-tx path
   * via the `options.via` selector. See {@link sendAndWaitForReply}.
   */
  sendAndWait(mirror: Address, payload: Hex, options: SendAndWaitOptions = {}): Promise<ReplyResult> {
    return sendAndWaitForReply(this._provider, this._ethClient, mirror, payload, options);
  }
}
