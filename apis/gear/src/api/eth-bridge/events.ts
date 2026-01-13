import { GenericEventData, Struct, U256, u8, Vec } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';

import { HexString } from '../../types';
import { GearApi } from '../../GearApi';

/**
 * The Message from GearEthBridge.MessageQueued event
 */
class GearEthBridgeMessage {
  /** Unique identifier for the message */
  public readonly nonce: bigint;
  /** Source address where the message originated */
  public readonly source: `0x${string}`;
  /** Destination address where the message should be delivered */
  public readonly destination: `0x${string}`;
  /** The actual message data as hex-encoded bytes */
  public readonly payload: `0x${string}`;

  constructor(msg: GearEthBridgeMessageQueuedMessageCodec) {
    this.nonce = msg.nonce.toBigInt();
    this.source = msg.source.toHex();
    this.destination = msg.destination.toHex();
    this.payload = msg.payload.toHex();
  }
}

interface GearEthBridgeMessageQueuedCodec extends GenericEventData {
  readonly message: GearEthBridgeMessageQueuedMessageCodec;
  readonly hash: H256;
}

interface GearEthBridgeMessageQueuedMessageCodec extends Struct {
  readonly nonce: U256;
  readonly source: H256;
  readonly destination: H256;
  readonly payload: Vec<u8>;
}

/**
 * Type mapping for all Gear-Ethereum bridge events and their parameters.
 *
 * Each event type maps to an array of its parameter types for type safety.
 */
interface GearEthBridgeEventNames {
  /** Grandpa validator's keys set was hashed and set in storage at first block of the last session in the era. */
  AuthoritySetHashChanged: [HexString];
  /** Authority set hash was reset. */
  AuthoritySetReset: [];
  /** Optimistically, single-time called event defining that pallet got initialized */
  BridgeInitialized: [];
  /** Bridge was paused and temporary doesn't process any incoming requests. */
  BridgePaused: [];
  /** Bridge was unpaused and from now on processes any incoming requests. */
  BridgeUnpaused: [];
  /** A new message was queued for bridging. */
  MessageQueued: {
    /** Enqueued message. */
    message: GearEthBridgeMessage;
    /** Hash of the enqueued message. */
    hash: HexString;
  };
  /** Merkle root of the queue changed: new messages queued within the block. */
  QueueMerkleRootChanged: {
    /** Queue identifier. */
    queueId: bigint;
    /** Merkle root of the queue. */
    root: HexString;
  };
  /** Queue was reset. */
  QueueReset: [];
}

/**
 * Arguments for finding a bridge message by its nonce.
 */
interface FindByNonceArgs {
  /** The nonce of the message to search for */
  nonce: bigint;
  /** The block number to start searching from */
  fromBlock: number;
  /** Optional block number to stop searching at */
  toBlock?: number;
}

const SECTION = 'gearEthBridge';

/**
 * Event monitoring and filtering utilities for GearEthBridge pallet.
 */
export class GearEthBridgeEvents {
  constructor(private _api: GearApi) {}

  /**
   * Subscribe to a specific bridge event type.
   *
   * @param name - The name of the event to subscribe to
   * @param callback - Function called when the event occurs
   * @returns Unsubscribe function to stop listening for events
   */
  on<K extends keyof GearEthBridgeEventNames>(
    name: K,
    callback: (...args: unknown[]) => void | Promise<void>,
  ): () => Promise<void> {
    const unsub = this._api.query.system.events(async (events) => {
      const filtered = events.filter(({ event: { section, method } }) => section === SECTION && method === name);
      if (filtered.length === 0) return;

      for (const e of filtered) {
        if (['BridgeCleared', 'BridgeInitialized', 'BridgePaused', 'BridgeUnpaused'].includes(name)) {
          await callback();
          return;
        }

        if (['AuthoritySetHashChanged', 'QueueMerkleRootChanged'].includes(name)) {
          await callback(e.event.data.toHex());
        }
      }

      if (name === 'MessageQueued') {
        const { message, hash } = filtered[0].event.data as GearEthBridgeMessageQueuedCodec;
        await callback(new GearEthBridgeMessage(message), hash.toHex());
      }
    });

    return async () => {
      (await unsub)();
    };
  }

  /**
   * Find a bridge message by its nonce within a specified block range.
   *
   * This method subscribes to blocks starting from the specified block and searches
   * for a message with the given nonce. It will continue searching until either:
   * - The message is found
   * - The toBlock limit is reached (if specified)
   *
   * @param args - Search parameters including nonce and block range
   * @returns The found message or null if not found within the range
   */
  async findGearEthBridgeMessageByNonce({
    nonce,
    fromBlock,
    toBlock,
  }: FindByNonceArgs): Promise<GearEthBridgeMessage | null> {
    let resolver: ((message: GearEthBridgeMessage | null) => void) | null = null;

    const resultPromise = new Promise<GearEthBridgeMessage | null>((resolve) => {
      resolver = resolve;
    });

    let unsub: (() => void) | undefined;

    try {
      unsub = await this._api.blocks.subscribeToHeadsFrom(fromBlock, async (header) => {
        if (toBlock && header.number.toNumber() >= toBlock) {
          resolver(null);
        }

        const events = await this._api.at(header.hash).then((apiAt) => apiAt.query.system.events());

        const filtered = events.filter(
          ({ event: { section, method } }) => section === SECTION && method === 'MessageQueued',
        );

        if (filtered.length === 0) return;

        for (const { event } of filtered) {
          const { message } = event.data as GearEthBridgeMessageQueuedCodec;

          if (message.nonce.toBigInt() === nonce) {
            return resolver(new GearEthBridgeMessage(message));
          }
        }
      });

      return resultPromise;
    } finally {
      unsub?.();
    }
  }
}
