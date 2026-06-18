import type { PublicClient } from 'viem';

import type { StreamedBlockHeader, StreamHandlers, Unsubscribe } from './types.js';

/**
 * Options accepted by {@link watchBlocks}.
 */
export interface WatchBlocksOptions {
  /**
   * If true, also emit pending blocks (not just confirmed). Default: false.
   * Forwarded to viem's `watchBlocks({ includeTransactions, blockTag })` —
   * pending blocks have `number === null`, which this stream skips.
   */
  includePending?: boolean;
}

/**
 * Subscribes to new block headers from the Ethereum L1 chain the Public Client
 * is connected to.
 *
 * Wraps viem's `publicClient.watchBlocks` — re-connection and polling fallback
 * are handled by viem internally.
 *
 * @param publicClient - viem PublicClient (typically `ethClient.publicClient`)
 * @param handlers - {@link StreamHandlers}
 * @param options - {@link WatchBlocksOptions}
 * @returns {@link Unsubscribe} call this to stop the stream
 */
export function watchBlocks(
  publicClient: PublicClient,
  handlers: StreamHandlers<StreamedBlockHeader>,
  options: WatchBlocksOptions = {},
): Unsubscribe {
  return publicClient.watchBlocks({
    blockTag: options.includePending ? 'pending' : 'latest',
    onBlock: (block) => {
      if (block.number === null || block.hash === null) return; // pending blocks lack canonical IDs
      handlers.onEvent({
        number: block.number,
        hash: block.hash,
        parentHash: block.parentHash,
        timestamp: block.timestamp,
        baseFeePerGas: block.baseFeePerGas,
      });
    },
    onError: handlers.onError,
  });
}
