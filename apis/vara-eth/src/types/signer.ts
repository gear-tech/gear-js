import type { Address, Hash, Hex, TransactionRequest, TypedDataDomain } from 'viem';

/** The parameters for signing a typed data message */
export type SignTypedDataParams = {
  /** Type definitions for the message */
  types: Record<string, Array<{ name: string; type: string }>>;
  /** The primary type of the message */
  primaryType: string;
  /** The message to sign */
  message: Record<string, unknown>;
  /** Optional domain for the message */
  domain?: TypedDataDomain;
};

/** The result of signing a typed data message */
export type SignTypedDataResult = {
  /** The signature as a hex string (with 0x prefix) */
  signature: Hex;
  /** The r component of the signature */
  r: Hash;
  /** The s component of the signature */
  s: Hash;
  /** The v component of the signature */
  v: number;
};

/**
 * Minimal signer interface for signing messages and retrieving the address.
 * Used by injected transactions and Metamask Snap adapters.
 */
export interface IMessageSigner {
  /**
   * Sign a message using ECDSA
   * @param message - Message to sign (as Uint8Array or hex string)
   * @returns Signature as hex string (with 0x prefix)
   */
  signMessage(message: Uint8Array | string): Promise<Hash>;

  /**
   * Sign a typed data message using ECDSA
   *
   * @param message - Message to sign
   * @param types - Type definitions for the message
   * @param primaryType - Primary type of the message
   * @param domain - Optional domain for the message
   *
   * @returns Signature as hex string (with 0x prefix) and r/s/v components
   */
  signTypedData(params: SignTypedDataParams): Promise<SignTypedDataResult>;

  /**
   * Get the signer's Ethereum address
   * @returns Address as hex string (with 0x prefix)
   */
  getAddress(): Promise<Address>;
}

/**
 * Full signer interface that additionally supports sending on-chain transactions.
 * Used by Mirror, Router, and WrappedVara contract clients.
 */
export interface ITransactionSigner extends IMessageSigner {
  /**
   * Send a transaction using the signer
   * @param tx - Transaction request
   * @returns Transaction hash as hex string (with 0x prefix)
   */
  sendTransaction(tx: TransactionRequest): Promise<Hash>;
}

/**
 * @deprecated Use ITransactionSigner for on-chain transactions or IMessageSigner for message signing only.
 */
export type ISigner = ITransactionSigner;
