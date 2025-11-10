import type { EthersLikeSigner, ISigner } from '../../types/signer.js';
import { SigningError, AddressError } from '../../types/signer.js';

/**
 * Adapter for Ethers.js signers
 *
 * This adapter wraps any Ethers.js signer (Wallet, JsonRpcSigner, etc.)
 * and provides the unified ISigner interface.
 */
export class EthersAdapter implements ISigner {
  /**
   * Create a new Ethers adapter
   * @param signer - Ethers.js signer instance
   */
  constructor(private readonly signer: EthersLikeSigner) {}

  /**
   * Sign a message using the Ethers.js signer
   *
   * Ethers.js accepts both string and Uint8Array messages.
   * The signature is always returned as a hex string.
   *
   * @param message - Message to sign (string or Uint8Array)
   * @returns Signature as hex string with 0x prefix
   * @throws {SigningError} If signing fails
   */
  async signMessage(message: Uint8Array | string): Promise<string> {
    try {
      const signature = await this.signer.signMessage(message);
      return signature;
    } catch (error) {
      throw new SigningError(
        `Failed to sign message with Ethers signer: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined,
      );
    }
  }

  /**
   * Get the signer's Ethereum address
   *
   * @returns Address as hex string with 0x prefix
   * @throws {AddressError} If address retrieval fails
   */
  async getAddress(): Promise<string> {
    try {
      return await this.signer.getAddress();
    } catch (error) {
      throw new AddressError(
        `Failed to get address from Ethers signer: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined,
      );
    }
  }

  /**
   * Static factory method to create an adapter
   *
   * @param signer - Ethers.js signer instance
   * @returns New EthersAdapter instance
   *
   * @example
   * ```ts
   * import { Wallet } from 'ethers';
   *
   * const wallet = new Wallet(privateKey);
   * const adapter = EthersAdapter.from(wallet);
   * ```
   */
  static from(signer: EthersLikeSigner): EthersAdapter {
    return new EthersAdapter(signer);
  }
}
