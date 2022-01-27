import { GearApi } from './GearApi';
import { AnyTuple } from '@polkadot/types/types';
import { GenericExtrinsic, Vec } from '@polkadot/types';
import { SignedBlock } from '@polkadot/types/interfaces';
import { FrameSystemEventRecord } from '@polkadot/types/lookup';

export class GearBlock {
  protected api: GearApi;
  constructor(api: GearApi) {
    this.api = api;
  }

  async get(hash: `0x${string}` | Uint8Array): Promise<SignedBlock> {
    return await this.api.rpc.chain.getBlock(hash);
  }

  /**
   *
   * @param blockHash hash of particular block in which the events are located
   * @returns Vec of extrinsics
   */
  async getExtrinsics(blockHash: `0x${string}` | Uint8Array): Promise<Vec<GenericExtrinsic<AnyTuple>>> {
    return (await this.get(blockHash)).block.extrinsics;
  }

  /**
   *
   * @param blockHash hash of particular block in which the events are located
   * @returns Vec of events
   */
  async getEvents(blockHash: `0x${string}` | Uint8Array): Promise<Vec<FrameSystemEventRecord>> {
    const apiAt = await this.api.at(blockHash);
    return await apiAt.query.system.events();
  }
}
