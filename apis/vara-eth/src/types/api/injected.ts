import type { Address, Hex } from 'viem';

import type { ReplyCode } from '../../errors/index.js';

export interface IInjectedTransaction {
  /**
   * The address of the destination program
   */
  readonly destination: Address;
  /**
   * Payload of the message
   */
  readonly payload: Hex;
  /**
   * Value attached to the message
   * Default: 0n
   */
  value?: bigint;
  /**
   * Reference block hash
   */
  referenceBlock?: Hex;
  /**
   * Arbitrary bytes to allow multiple synonymous transactions
   * to be sent simultaneously.
   * Default value is randomly generated
   */
  salt?: Hex;
  /**
   * Address of validator the transaction is intended for
   */
  recipient?: Address;
}

export interface IInjectedTransactionPromise {
  readonly txHash: Hex;
  readonly payload: Hex;
  readonly value: bigint;
  // TODO: consider moving it to a `common` package to reuse in both @gear-js/api and @vara-eth/api
  readonly code: ReplyCode;
  readonly signature: Hex;
}
