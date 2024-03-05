import { GearApi } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { FrameSystemEventRecord } from '@polkadot/types/lookup';
import { SignedBlock } from '@polkadot/types/interfaces';
import { logger } from '@gear-js/common';
import { VoidFn } from '@polkadot/api/types';
import { Vec } from '@polkadot/types';

import { Block } from '../database/entities';
import { BlockService, CodeService, MessageService, ProgramService, StatusService } from '../services';
import { TempState } from './temp-state';
import { RMQService } from '../rmq';
import {
  handleBatchTxs,
  handleCodeTxs,
  handleEvents,
  handleMsgTxs,
  handleProgramTxs,
  handleVoucherTxs,
} from './handlers';
import { HandlerParams } from '../common/types/indexer';
import config from '../config';
import { CronJob } from 'cron';

const getMem = () => {
  const mem = process.memoryUsage();
  for (const key in mem) {
    mem[key] = (mem[key] / 1024 / 1024).toFixed(2) + ' MB';
  }
  return mem;
};

export class GearIndexer {
  public api: GearApi;
  private genesis: HexString;
  private unsub: VoidFn;
  private newBlocks: Array<number>;
  private generatorLoop: boolean;
  private tempState: TempState;
  private isCheckingNotSynced: boolean;

  constructor(
    private programService: ProgramService,
    private messageService: MessageService,
    private codeService: CodeService,
    private blockService: BlockService,
    private rmq: RMQService,
    private statusService: StatusService,
  ) {
    this.tempState = new TempState(programService, messageService, codeService, blockService, rmq);
  }

  public async run(api: GearApi) {
    this.api = api;

    this.genesis = this.api.genesisHash.toHex();

    await this.statusService.init(this.genesis);

    this.newBlocks = [];
    this.generatorLoop = true;

    new CronJob(
      '*/30 * * * *',
      () => {
        this.indexNotSyncedBlocks().then(() => {
          logger.info('Not synced blocks have been indexed');
        });
      },
      null,
      true,
      null,
      null,
      true,
    );

    this.unsub = await this.api.derive.chain.subscribeNewHeads(({ number }) => {
      this.newBlocks.push(number.toNumber());
    });
    this.indexBlocks();
  }

  public stop() {
    this.generatorLoop = false;
    if (this.unsub) {
      this.unsub();
    }
    this.api = null;
    this.newBlocks = [];
  }

  private async *blocksGenerator() {
    while (this.generatorLoop) {
      if (this.newBlocks.length === 0) {
        await new Promise((resolve) => {
          setTimeout(resolve, 3000);
        });
        continue;
      }
      yield this.newBlocks.splice(0, 5);
    }
  }

  private *rangeGenerator(from: number, to: number) {
    const batchSize = config.indexer.batchSize;
    for (let i = from; i < to; i += batchSize) {
      yield [...Array(batchSize).keys()].map((v) => v + i);
    }
  }

  private async indexNotSyncedBlocks() {
    if (this.isCheckingNotSynced) {
      return;
    }

    this.isCheckingNotSynced = true;

    const status = await this.statusService.getStatus(this.genesis);

    const lastBlockNumber = status ? Number(status.height) : config.indexer.fromBlock;

    const currentBn = await this.api.rpc.chain.getHeader();

    let tempState = new TempState(
      this.programService,
      this.messageService,
      this.codeService,
      this.blockService,
      this.rmq,
    );

    for (const blockNumbers of this.rangeGenerator(lastBlockNumber, currentBn.number.toNumber())) {
      const notSynced = await this.blockService.getNotSynced(blockNumbers);

      if (notSynced.length === 0) {
        await this.statusService.update(this.genesis, blockNumbers.at(-1).toString());
        continue;
      }

      const start = Date.now();

      tempState.newState(this.genesis);

      try {
        await Promise.all(notSynced.map((blockNumber) => this.indexBlock(blockNumber, this.tempState)));
      } catch (error) {
        logger.error('Error during indexing the data of the blocks', {
          blocks: notSynced,
          error: error.message,
          stack: error.stack,
        });
        continue;
      }

      try {
        const result = await this.tempState.save();

        const [min, max] = [Math.min(...notSynced) + '', Math.max(...notSynced) + ''];

        await this.statusService.update(this.genesis, max);

        logger.info(`${min}-${max} not synced`, {
          time: (Date.now() - start) / 1000 + 'sec',
          mem: getMem(),
          result: result,
        });
      } catch (error) {
        logger.error('Error during saving the data of the blocks', {
          blocks: notSynced,
          error: error.message,
          stack: error.stack,
        });
      }
    }

    tempState = null;
    await this.statusService.update(this.genesis, currentBn.number.toString());

    this.isCheckingNotSynced = false;
  }

  private async indexBlocks() {
    for await (const blockNumbers of this.blocksGenerator()) {
      if (this.api === null) {
        logger.warn('api null');
        this.newBlocks.push(...blockNumbers);
        continue;
      }

      const start = Date.now();

      this.tempState.newState(this.genesis);

      try {
        await Promise.all(blockNumbers.map((blockNumber) => this.indexBlock(blockNumber, this.tempState)));
      } catch (error) {
        logger.error('Error during indexing the data of the blocks', {
          blocks: blockNumbers,
          error: error.message,
          stack: error.stack,
        });
        continue;
      }

      try {
        const result = await this.tempState.save();

        logger.info(`${blockNumbers[0]}-${blockNumbers.at(-1)}`, {
          time: (Date.now() - start) / 1000 + 'sec',
          mem: getMem(),
          result: result,
        });
      } catch (error) {
        logger.error('Error during saving the data of the blocks', {
          blocks: blockNumbers,
          error: error.message,
          stack: error.stack,
        });
      }
    }
  }

  private async indexBlock(blockNumber: number, tempState: TempState): Promise<void> {
    if (blockNumber === 0) return;

    let block: SignedBlock;
    let events: Vec<FrameSystemEventRecord>;
    let hash: string;

    try {
      hash = (await this.api.rpc.chain.getBlockHash(blockNumber)).toHex();
      [block, events] = await Promise.all([
        this.api.rpc.chain.getBlock(hash),
        this.api.at(hash).then((apiAt) => apiAt.query.system.events()),
      ]);
    } catch (error) {
      logger.error('Unable to get block', { number: blockNumber, error: error.message });
      return;
    }

    const params: HandlerParams = {
      api: this.api,
      block,
      events,
      tempState,
      timestamp: new Date((await this.api.blocks.getBlockTimestamp(block)).toNumber()),
      status: this.api.createType('ExtrinsicStatus', { finalized: block.block.header.hash.toHex() }),
      blockHash: hash,
      genesis: this.genesis,
    };

    await Promise.all([
      handleCodeTxs(params),
      handleBatchTxs(params),
      handleProgramTxs(params),
      handleMsgTxs(params),
      handleVoucherTxs(params),
    ]);

    await handleEvents(params);

    tempState.addBlock(
      new Block({
        hash,
        number: blockNumber.toString(),
        timestamp: params.timestamp,
        genesis: this.genesis,
      }),
    );
  }
}
