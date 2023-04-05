import { waitReady } from '@polkadot/wasm-crypto';

import { changeStatus, runHealthcheckServer } from './healthcheck';
import { AppDataSource } from './database';
import { BlockService, StatusService } from './services';
import { CodeService } from './services';
import { MessageService } from './services';
import { ProgramService } from './services';
import { MetaService } from './services';
import { GearHelper, GearIndexer } from './gear';
import { GearApi } from '@gear-js/api';
import config from './config';
import { logger } from './common';

async function bootstrap() {
  runHealthcheckServer();

  const dataSource = await AppDataSource.initialize();

  changeStatus('database');

  await waitReady();

  const helper = new GearHelper();

  const blockService = new BlockService(dataSource);
  const codeService = new CodeService(dataSource);
  const programService = new ProgramService(dataSource);
  const metaService = new MetaService(dataSource, programService, codeService, helper);
  const messageService = new MessageService(dataSource, programService);
  const statusService = new StatusService(dataSource);

  const api = new GearApi({ providerAddress: config.gear.wsProvider });
  try {
    await api.isReadyOrError;
  } catch (error) {
    logger.error(`Failed to connect to ${config.gear.wsProvider}`);
    throw error;
  }
  await api.isReady;
  const genesis = api.genesisHash.toHex();
  logger.info(`⚙️ Connected to ${api.runtimeChain} with genesis ${genesis}`);

  let fromBlock = 1;
  const status = await statusService.getStatus(genesis);

  if (status) {
    fromBlock = Number(status.height) + 1;
  }

  const lastBlock = await blockService.getLastBlock(genesis);
  const toBlock = Number(lastBlock.number);

  const syncedBlocks = await blockService.getSyncedBlockNumbers(fromBlock, toBlock, genesis);

  const it = getIterator(fromBlock, toBlock);

  const blocks = [];
  let res = it.next();
  if (!syncedBlocks.includes(res.value)) {
    blocks.push(res.value);
  }
  while (!res.done) {
    res = it.next();
    if (!syncedBlocks.includes(res.value)) {
      blocks.push(res.value);
    }
  }

  const indexer = new GearIndexer(
    programService,
    messageService,
    codeService,
    blockService,
    metaService,
    statusService,
    true,
    true,
  );

  await indexer.run(api, blocks);
}

bootstrap()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

function getIterator(start: number, end: number) {
  let nextIndex = start;
  let count = 0;
  const iterator = {
    next(): { value: number; done: boolean } {
      let res;
      if (nextIndex < end) {
        res = { value: nextIndex, done: false };
        nextIndex += 1;
        count++;
        return res;
      }
      return { value: count, done: true };
    },
  };
  return iterator;
}
