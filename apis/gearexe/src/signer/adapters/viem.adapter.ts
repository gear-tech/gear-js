import type { ViemLikeSigner, ISigner } from '../../types/signer.js';
import { SigningError, AddressError } from '../../types/signer.js';

/**
 * Adapter for Viem wallet clients
 *
 * This adapter wraps a Viem wallet client and provides the unified ISigner interface.
 * The account can be provided explicitly or taken from the client's account property.
 */
export class ViemAdapter implements ISigner {
  private readonly account?: `0x${string}` | { address: string };

  /**
   * Create a new Viem adapter
   *
   * @param client - Viem wallet client instance
   * @param account - Optional account to use for signing (if not provided, uses client.account)
   */
  constructor(
    private readonly client: ViemLikeSigner,
    account?: `0x${string}` | { address: string },
  ) {
    this.account = account || client.account;
  }

  /**
   * Sign a message using the Viem wallet client
   *
   * Viem expects messages in a specific format with the account parameter.
   * For Uint8Array messages, we wrap them in a `{ raw: ... }` object.
   *
   * @param message - Message to sign (string or Uint8Array)
   * @returns Signature as hex string with 0x prefix
   * @throws {SigningError} If signing fails or no account is available
   */
  async signMessage(message: Uint8Array | string): Promise<string> {
    const account = this.account || this.client.account;

    if (!account) {
      throw new SigningError('No account available for signing. Please provide an account to the ViemAdapter.');
    }

    try {
      // Viem expects message in specific format
      // For strings, pass directly
      // For Uint8Array, wrap in { raw: ... } object
      const messageArg = typeof message === 'string' ? message : ({ raw: message } as any);

      const signature = await this.client.signMessage({
        message: messageArg,
        account,
      });

      return signature;
    } catch (error) {
      throw new SigningError(
        `Failed to sign message with Viem client: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined,
      );
    }
  }

  /**
   * Get the signer's Ethereum address
   *
   * Extracts the address from the account, which can be either a string
   * or an object with an address property.
   *
   * @returns Address as hex string with 0x prefix
   * @throws {AddressError} If no account is available
   */
  async getAddress(): Promise<string> {
    const account = this.account || this.client.account;

    if (!account) {
      throw new AddressError('No account available. Please provide an account to the ViemAdapter.');
    }

    return typeof account === 'string' ? account : account.address;
  }

  /**
   * Static factory method to create an adapter
   *
   * @param client - Viem wallet client instance
   * @param account - Optional account to use for signing
   * @returns New ViemAdapter instance
   *
   * @example
   * ```ts
   * import { createWalletClient, http } from 'viem';
   *
   * const client = createWalletClient({ transport: http() });
   * const adapter = ViemAdapter.from(client, '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
   * ```
   */
  static from(client: ViemLikeSigner, account?: `0x${string}` | { address: string }): ViemAdapter {
    return new ViemAdapter(client, account);
  }
}
