import type { Address, Hash, TransactionRequest } from 'viem';

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
