import { GearApi } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { SignedBlock } from '@polkadot/types/interfaces';
import { logger } from '@gear-js/common';
import { ApiDecoration, VoidFn } from '@polkadot/api/types';

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
  private _lastProcessedBlock: number;

  constructor(
    private programService: ProgramService,
    private messageService: MessageService,
    private codeService: CodeService,
    private blockService: BlockService,
    private rmq: RMQService,
    private statusService: StatusService,
  ) {}

  public async run(api: GearApi) {
    this.api = api;

    this.tempState = new TempState(
      this.programService,
      this.messageService,
      this.codeService,
      this.blockService,
      this.rmq,
      this.api,
    );

    this.genesis = this.api.genesisHash.toHex();

    await Promise.all([
      this.programService.removeDuplicates(this.genesis),
      this.codeService.removeDuplicates(this.genesis),
    ]);

    await this.statusService.init(this.genesis);

    this._lastProcessedBlock = +(await this.blockService.getLastBlock({ genesis: this.genesis }))?.number || 0;

    this.newBlocks = [];
    this.generatorLoop = true;

    new CronJob(
      '0 0 * * * *',
      () => {
        this.indexNotSyncedBlocks().then(() => {
          logger.info('Not synced blocks have been indexed');
        });
      },
      null,
      true,
      'UTC',
      null,
      true,
    );

    this.unsub = await this.api.derive.chain.subscribeNewHeads(({ number }) => {
      this.newBlocks.push(number.toNumber());
    });
    this.indexBlocks();

    this._checkBlockProcessing();
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

  private async *rangeGenerator(from: number, to: number) {
    const batchSize = config.indexer.batchSize;

    let notSynced = [];

    for (let i = from; i < to; i += batchSize) {
      const batch = [...Array(batchSize).keys()].map((v) => v + i);

      notSynced.push(...(await this.blockService.getNotSynced(batch)));

      if (notSynced.length < batchSize) {
        continue;
      }

      yield notSynced;

      notSynced = [];
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
      this.api,
    );

    for await (const blockNumbers of this.rangeGenerator(lastBlockNumber, currentBn.number.toNumber())) {
      if (this.api === null) {
        this.isCheckingNotSynced = false;
        return;
      }

      const start = Date.now();

      tempState.newState(this.genesis);

      try {
        await Promise.all(blockNumbers.map((blockNumber) => this.indexBlock(blockNumber, tempState)));
      } catch (error) {
        logger.error('Failed to index blocks (not synced)', {
          blocks: blockNumbers,
          error: error.message,
          stack: error.stack,
        });
        continue;
      }

      try {
        const result = await tempState.save();

        const [min, max] = [Math.min(...blockNumbers) + '', Math.max(...blockNumbers) + ''];

        await this.statusService.update(this.genesis, max);

        logger.info(`${min}-${max} not synced`, {
          time: (Date.now() - start) / 1000 + 'sec',
          mem: getMem(),
          result: result,
        });
      } catch (error) {
        logger.error('Failed to save block data (not synced)', {
          blocks: blockNumbers,
          error: error.message,
          stack: error.stack,
        });
      }

      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
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
        logger.error('Failed to index blocks', {
          blocks: blockNumbers,
          error: error.message,
          stack: error.stack,
        });
        continue;
      }

      try {
        const result = await this.tempState.save();

        if (result.c > 0 || result.p > 0 || result.m > 0) {
          logger.info(`${blockNumbers[0]}-${blockNumbers.at(-1)}`, {
            time: (Date.now() - start) / 1000 + 'sec',
            mem: getMem(),
            result: result,
          });
        }
      } catch (error) {
        logger.error('Failed to save block data', {
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
    let apiAt: ApiDecoration<'promise'>;
    let hash: string;

    try {
      hash = (await this.api.rpc.chain.getBlockHash(blockNumber)).toHex();
      [block, apiAt] = await Promise.all([this.api.rpc.chain.getBlock(hash), this.api.at(hash)]);
    } catch (error) {
      logger.error('Unable to get block', { number: blockNumber, hash, error: error.message });
      return;
    }

    const [events, tsU64] = await Promise.all([apiAt.query.system.events(), apiAt.query.timestamp.now()]);

    const params: HandlerParams = {
      api: this.api,
      block,
      events,
      tempState,
      timestamp: new Date(tsU64.toNumber()),
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

  private _checkBlockProcessing() {
    const job = new CronJob('*/1 * * * *', async () => {
      const lastBlock = await this.blockService.getLastBlock({ genesis: this.genesis });

      if (+lastBlock?.number <= this._lastProcessedBlock) {
        logger.error('Block processing is stuck', { lastBlock: this._lastProcessedBlock });
      } else {
        this._lastProcessedBlock = +lastBlock.number;
      }
    });

    job.start();
  }
}
