import { GearApi } from './GearApi';
import { AnyTuple, AnyNumber } from '@polkadot/types/types';
import { Compact, GenericExtrinsic, Vec } from '@polkadot/types';
import { SignedBlock, BlockNumber, BlockHash } from '@polkadot/types/interfaces';
import { FrameSystemEventRecord } from '@polkadot/types/lookup';
import { GetBlockError } from './errors/blocks.errors';

export class GearBlock {
  protected api: GearApi;
  constructor(api: GearApi) {
    this.api = api;
  }

  /**
   * Get data of particular block
   * @param hash
   * @returns
   */
  async get(hash: `0x${string}` | Uint8Array): Promise<SignedBlock> {
    try {
      return await this.api.rpc.chain.getBlock(hash);
    } catch (error) {
      throw new GetBlockError(error.message, hash);
    }
  }

  /**
   * Get blockHash by number
   * @param number number of block
   * @returns blockHash
   */
  async getBlockHash(number: AnyNumber | BlockNumber): Promise<BlockHash> {
    return await this.api.rpc.chain.getBlockHash(number);
  }

  /**
   * Get block number
   * @param hash
   * @returns Compact<BlockNumber>
   */
  async getBlockNumber(hash: `0x${string}` | Uint8Array): Promise<Compact<BlockNumber>> {
    const block = await this.get(hash);
    return block.block.header.number;
  }

  /**
   * Get all extrinsic of particular block
   * @param blockHash hash of particular block
   * @returns Vec of extrinsics
   */
  async getExtrinsics(blockHash: `0x${string}` | Uint8Array): Promise<Vec<GenericExtrinsic<AnyTuple>>> {
    return (await this.get(blockHash)).block.extrinsics;
  }

  /**
   * Get all events of particular block
   * @param blockHash hash of particular block
   * @returns Vec of events
   */
  async getEvents(blockHash: `0x${string}` | Uint8Array): Promise<Vec<FrameSystemEventRecord>> {
    const apiAt = await this.api.at(blockHash);
    return await apiAt.query.system.events();
  }

  /**
   * Get hash of last finalized block
   * @returns Hash of finalized head
   */
  async getFinalizedHead(): Promise<BlockHash> {
    return await this.api.rpc.chain.getFinalizedHead();
  }
}
