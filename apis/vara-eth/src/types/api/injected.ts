import { HexString } from '../../types/index.js';

export interface IInjectedTransaction {
  /**
   * The address of the destination program
   */
  readonly destination: HexString;
  /**
   * Payload of the message
   */
  readonly payload: HexString;
  /**
   * Value attached to the message
   * Default: 0n
   */
  value?: bigint;
  /**
   * Reference block hash
   */
  referenceBlock?: HexString;
  /**
   * Arbitrary bytes to allow multiple synonymous transactions
   * to be sent simultaneously.
   * Default value is randomly generated
   */
  salt?: HexString;
  /**
   * Address of validator the transaction intended for
   */
  recipient?: HexString;
}

export interface IInjectedTransactionPromise {
  readonly txHash: HexString;
  readonly reply: {
    readonly payload: HexString;
    readonly value: number;
    // TODO: define an interface for this field
    // TODO: consider moving it to a `common` package to reuse in both @gear-js/api and @vara-eth/api
    readonly code: { Success: string } | { Error: string };
  };
  readonly signature: HexString;
}
