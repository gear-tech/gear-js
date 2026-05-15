import type { Address } from 'viem';

import type { EthereumClient } from '../../eth/index.js';
import { watchBlocks, type WatchBlocksOptions } from './blocks.js';
import { watchProgramEvents, type WatchProgramEventsOptions } from './program-events.js';
import { watchRouterEvents, type WatchRouterEventsOptions } from './router-events.js';
import type {
  ProgramEvent,
  RouterEvent,
  StreamedBlockHeader,
  StreamHandlers,
  Unsubscribe,
} from './types.js';

export type {
  EventMeta,
  ProgramEvent,
  RouterEvent,
  StreamedBlockHeader,
  StreamHandlers,
  Unsubscribe,
  WatchEventsOptions,
} from './types.js';
export { buildEventMeta } from './types.js';
export type { WatchBlocksOptions } from './blocks.js';
export type { WatchProgramEventsOptions } from './program-events.js';
export type { WatchRouterEventsOptions } from './router-events.js';
export { watchBlocks, watchProgramEvents, watchRouterEvents };

/**
 * Convenience namespace attached to {@link VaraEthApi} as `api.stream`.
 *
 * Each method wraps viem's poll-based `watch*` primitives and returns an
 * unsubscribe function. Re-connection and polling fallback are handled by viem
 * internally — these helpers add typed discriminated unions on top.
 */
export class StreamNamespace {
  constructor(private readonly _ethClient: EthereumClient) {}

  /** See {@link watchProgramEvents}. */
  programEvents(
    mirror: Address,
    handlers: StreamHandlers<ProgramEvent>,
    options?: WatchProgramEventsOptions,
  ): Unsubscribe {
    return watchProgramEvents(this._ethClient.publicClient, mirror, handlers, options);
  }

  /** See {@link watchRouterEvents}. */
  routerEvents(handlers: StreamHandlers<RouterEvent>, options?: WatchRouterEventsOptions): Unsubscribe {
    return watchRouterEvents(this._ethClient.publicClient, this._ethClient.router.address, handlers, options);
  }

  /** See {@link watchBlocks}. */
  blocks(handlers: StreamHandlers<StreamedBlockHeader>, options?: WatchBlocksOptions): Unsubscribe {
    return watchBlocks(this._ethClient.publicClient, handlers, options);
  }
}
