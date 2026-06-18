import type { Chain, Hex, PublicClient } from 'viem';
import { createWalletClient, custom } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import type { ITransactionSigner } from '../../types/signer.js';
import { WalletClientAdapter } from './wallet-client.js';

/**
 * A self-contained {@link ITransactionSigner} backed by a raw secp256k1 private
 * key held in process memory.
 *
 * Convenience wrapper around viem's `privateKeyToAccount` + `createWalletClient`.
 * Suitable for scripts, tests, and CLI flows where the caller already holds the
 * key material. **Not** intended for browser dApps — those should keep using
 * `walletClientToSigner` against an injected provider (MetaMask, WalletConnect).
 *
 * The signer creates a viem `WalletClient` that re-uses the supplied
 * `PublicClient`'s transport (so the signer talks to the same Ethereum node as
 * the rest of `@vara-eth/api`).
 */
export class LocalSigner extends WalletClientAdapter {
  /**
   * @param privateKey - 32-byte secp256k1 private key as a `0x`-prefixed hex string
   * @param publicClient - viem PublicClient whose transport + chain will be reused
   */
  constructor(privateKey: Hex, publicClient: PublicClient) {
    const account = privateKeyToAccount(privateKey);
    // `publicClient.transport` is the constructed transport (the result of
    // `http()` / `webSocket()`), not the factory `createWalletClient` expects.
    // Wrap the client's EIP-1193 request method into a fresh transport factory.
    const transport = custom({ request: publicClient.request });
    const chain = publicClient.chain as Chain | undefined;
    const walletClient = createWalletClient({ account, transport, chain });
    super(walletClient);
  }
}

/**
 * Convenience factory for {@link LocalSigner}.
 *
 * @param privateKey - 32-byte secp256k1 private key as a `0x`-prefixed hex string
 * @param publicClient - viem PublicClient whose transport + chain will be reused
 * @returns A {@link LocalSigner} instance implementing {@link ITransactionSigner}
 *
 * @example
 * ```ts
 * import { createPublicClient, http } from 'viem';
 * import { privateKeyToLocalSigner } from '@vara-eth/api/signer';
 *
 * const publicClient = createPublicClient({ transport: http('http://localhost:8545') });
 * const signer = privateKeyToLocalSigner('0xac09...', publicClient);
 * // signer satisfies ITransactionSigner — pass to createVaraEthApi(...).
 * ```
 */
export function privateKeyToLocalSigner(privateKey: Hex, publicClient: PublicClient): LocalSigner {
  return new LocalSigner(privateKey, publicClient);
}

/**
 * Type guard: narrow an {@link ITransactionSigner} to {@link LocalSigner} when
 * callers need to introspect the underlying account (e.g. CLI debug output).
 */
export function isLocalSigner(signer: ITransactionSigner): signer is LocalSigner {
  return signer instanceof LocalSigner;
}
