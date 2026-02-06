import type { Address, Hash, TransactionRequest } from 'viem';

/**
 * Unified signer interface that all adapters must implement.
 * This is the core interface used throughout the library.
 */
export interface ISigner {
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

  /**
   * Send a transaction using the signer
   * @param tx - Transaction request
   * @returns Transaction hash as hex string (with 0x prefix)
   */
  sendTransaction(tx: TransactionRequest): Promise<Hash>;
}
