import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';

import { GearApi } from '../../GearApi';
import { HexString } from '../../types';

/**
 * Transaction building utilities for Gear-Ethereum bridge operations.
 *
 * This class provides methods to create extrinsics for bridge transactions
 * that can be signed and submitted to the network.
 */
export class GearEthBridgeTransactions {
  constructor(private _api: GearApi) {}

  /**
   * Extrinsic that inserts message in a bridging queue,
   * updating queue merkle root at the end of the block.
   *
   * @param destination - The Ethereum address to send the message to
   * @param payload - The message payload data
   * @returns A submittable extrinsic that can be signed and sent
   */
  sendEthMessage(
    destination: HexString | Uint8Array,
    payload: HexString | Uint8Array,
  ): SubmittableExtrinsic<'promise', ISubmittableResult> {
    return this._api.tx.gearEthBridge.sendEthMessage(destination, payload);
  }
}
