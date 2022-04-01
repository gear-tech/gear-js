import { GearApi } from './GearApi';
import { GetBlockError } from './errors/blocks.errors';
import { AnyTuple, AnyNumber } from '@polkadot/types/types';
import { u64, Compact, GenericExtrinsic, Vec } from '@polkadot/types';
import { SignedBlock, BlockNumber, BlockHash } from '@polkadot/types/interfaces';
import { FrameSystemEventRecord } from '@polkadot/types/lookup';
import { isHex, isU8a } from '@polkadot/util';
import { CreateType } from './create-type';
export class GearBlock {
  protected api: GearApi;
  constructor(api: GearApi) {
    this.api = api;
  }

  /**
   * Get data of particular block by blockHash
   * @param hash
   * @returns
   */
  async get(hash: `0x${string}` | Uint8Array): Promise<SignedBlock>;

  /**
   * Get data of particular block by blockNumber
   * @param number
   * @returns
   */
  async get(number: number): Promise<SignedBlock>;

  /**
   * Get data of particular block by blockNumber or blockHash
   * @param hashOrNumber
   * @returns
   */
  async get(hashOrNumber: `0x${string}` | Uint8Array | number): Promise<SignedBlock>;

  /**
   * Get data of particular block by blockNumber or blockHash
   * @param hashOrNumber
   * @returns
   */
  async get(hashOrNumber: `0x${string}` | Uint8Array | number): Promise<SignedBlock> {
    const hash = isU8a(hashOrNumber) || isHex(hashOrNumber) ? hashOrNumber : await this.getBlockHash(+hashOrNumber);
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
   * Get timestamp of block
   * @param hashOrNumber hash or number of particular block
   * @returns
   */
  async getBlockTimestamp(hashOrNumber: `0x${string}` | Uint8Array | number): Promise<Compact<u64>> {
    const block = await this.get(hashOrNumber);
    const tsAsU8a = block.block.extrinsics.find(
      (value) => value.method.method === 'set' && value.method.section === 'timestamp',
    ).data;
    const ts = CreateType.create('Compact<u64>', tsAsU8a);
    return ts as Compact<u64>;
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
    return apiAt.query.system.events();
  }

  /**
   * Get hash of last finalized block
   * @returns Hash of finalized head
   */
  async getFinalizedHead(): Promise<BlockHash> {
    return this.api.rpc.chain.getFinalizedHead();
  }
}
