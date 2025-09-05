import { AuthoritySetHashError, ClearTimerError, GetQueueMerkleRootError } from '../../errors';
import { GearApi } from '../../GearApi';
import { HexString, Proof } from '../../types';
import { GearEthBridgeEvents } from './events';
import { GearEthBridgeTransactions } from './tx';

/**
 * API for interacting with the Gear-Ethereum bridge pallet.
 *
 * Provides access to bridge state queries, transaction building, and event monitoring.
 * The bridge enables bidirectional message passing between Gear and Ethereum networks.
 */
export class GearEthBridge {
  /** Transaction building utilities for bridge operations */
  public readonly tx: GearEthBridgeTransactions;

  /** Event monitoring and filtering utilities */
  public readonly events: GearEthBridgeEvents;

  constructor(private _api: GearApi) {
    this.tx = new GearEthBridgeTransactions(_api);
    this.events = new GearEthBridgeEvents(_api);
  }

  /**
   * Get the merkle proof for a given hash.
   * @param hash The hash of the message to get the merkle proof for.
   * @param at (optional) The block hash to query at.
   * @returns The merkle proof.
   */
  async merkleProof(hash: HexString | Uint8Array, at?: HexString | Uint8Array): Promise<Proof> {
    return this._api.rpc.gearEthBridge.merkleProof(hash, at);
  }

  /**
   * Get the current authority set hash.
   *
   * @returns The authority set hash as a hex string
   * @throws {AuthoritySetHashError} When the authority set hash is not available
   */
  async authoritySetHash(): Promise<HexString> {
    const result = await this._api.query.gearEthBridge.authoritySetHash();

    if (result.isNone) {
      throw new AuthoritySetHashError();
    }

    return result.unwrap().toHex();
  }

  /**
   * Get the current clear timer value.
   *
   * @returns The clear timer value as a number
   * @throws {ClearTimerError} When the clear timer is not available
   */
  async clearTimer(): Promise<number> {
    const result = await this._api.query.gearEthBridge.clearTimer();

    if (result.isNone) {
      throw new ClearTimerError();
    }

    return result.unwrap().toNumber();
  }

  /**
   * Check if the bridge has been initialized.
   *
   * @returns True if the bridge is initialized, false otherwise
   */
  async isInitialized(): Promise<boolean> {
    const result = await this._api.query.gearEthBridge.initialized();
    return result.toHuman();
  }

  /**
   * Get the current message nonce.
   *
   * @returns The current message nonce as a bigint
   */
  async getMessageNonce(): Promise<bigint> {
    const result = await this._api.query.gearEthBridge.messageNonce();
    return result.toBigInt();
  }

  /**
   * Check if the bridge is currently paused.
   *
   * When paused, the bridge will not process new messages.
   *
   * @returns True if the bridge is paused, false otherwise
   */
  async isPaused(): Promise<boolean> {
    const result = await this._api.query.gearEthBridge.paused();
    return result.toHuman();
  }

  /**
   * Get the current message queue.
   *
   * Returns an array of message hashes that are queued for processing.
   *
   * @returns Array of message hashes in the queue
   */
  async getQueue(): Promise<Array<HexString>> {
    const result = await this._api.query.gearEthBridge.queue();
    return result.toArray().map((hash) => hash.toHex());
  }

  /**
   * Check if the message queue has changed.
   *
   * @returns True if the queue has changed, false otherwise
   */
  async isQueueChanged(): Promise<boolean> {
    const result = await this._api.query.gearEthBridge.queueChanged();
    return result.toHuman();
  }

  /**
   * Get the merkle root of the current message queue.
   *
   * @returns The queue merkle root as a hex string
   * @throws {GetQueueMerkleRootError} When the merkle root is not available
   */
  async getQueueMerkleRoot(): Promise<HexString> {
    const result = await this._api.query.gearEthBridge.queueMerkleRoot();

    if (result.isNone) {
      throw new GetQueueMerkleRootError();
    }

    return result.unwrap().toHex();
  }

  /**
   * Get the current sessions timer value.
   *
   * @returns The sessions timer value as a number
   */
  async getSessionsTimer(): Promise<number> {
    const result = await this._api.query.gearEthBridge.sessionsTimer();
    return result.toNumber();
  }

  /**
   * Get the maximum allowed payload size for bridge messages.
   *
   * @returns The maximum payload size in bytes
   */
  get maxPayloadSize(): number {
    return this._api.consts.gearEthBridge.maxPayloadSize.toNumber();
  }

  /**
   * Get the maximum capacity of the message queue.
   *
   * @returns The queue capacity as a number of messages
   */
  get queueCapacity(): number {
    return this._api.consts.gearEthBridge.queueCapacity.toNumber();
  }

  /**
   * Get the number of sessions per era.
   *
   * @returns The number of sessions per era
   */
  get sessionsPerEra(): number {
    return this._api.consts.gearEthBridge.sessionsPerEra.toNumber();
  }
}
