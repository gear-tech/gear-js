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
  signMessage(message: Uint8Array | string): Promise<string>;

  /**
   * Get the signer's Ethereum address
   * @returns Address as hex string (with 0x prefix)
   */
  getAddress(): Promise<string>;
}

/**
 * Ethers.js v6 compatible signer interface
 */
export interface EthersLikeSigner {
  /**
   * Sign a message (Ethers.js method)
   */
  signMessage(message: string | Uint8Array): Promise<string>;

  /**
   * Get the address (Ethers.js method)
   */
  getAddress(): Promise<string>;
}

/**
 * Viem wallet client interface
 */
export interface ViemLikeSigner {
  /**
   * Sign a message (Viem method)
   */
  signMessage(args: {
    message: string | { raw: Uint8Array | string };
    account: `0x${string}` | { address: string };
  }): Promise<string>;

  /**
   * Account associated with this client (optional)
   */
  account?: `0x${string}` | { address: string };

  /**
   * Chain configuration (Viem-specific marker)
   */
  chain?: unknown;
}

/**
 * Union type of all accepted signer types
 *
 * This type represents any signer that can be automatically
 * adapted to the ISigner interface.
 */
export type AcceptedSigner = ISigner | EthersLikeSigner | ViemLikeSigner;

/**
 * Error thrown when a signer type is not recognized or supported
 */
export class UnsupportedSignerError extends Error {
  constructor(message: string = 'Unsupported signer type') {
    super(message);
    this.name = 'UnsupportedSignerError';
    Object.setPrototypeOf(this, UnsupportedSignerError.prototype);
  }
}

/**
 * Error thrown when a signing operation fails
 */
export class SigningError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = 'SigningError';
    Object.setPrototypeOf(this, SigningError.prototype);
  }
}

/**
 * Error thrown when address retrieval fails
 */
export class AddressError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = 'AddressError';
    Object.setPrototypeOf(this, AddressError.prototype);
  }
}
