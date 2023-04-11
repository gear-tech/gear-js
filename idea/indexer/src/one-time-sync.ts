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

  let syncedBlocks = await blockService.getSyncedBlockNumbers(fromBlock, toBlock, genesis);

  const blocksSet = new Set(syncedBlocks);

  const blocks = Array.from({ length: toBlock - fromBlock + 1 }, (_, i) => fromBlock + i).filter(
    (v) => !blocksSet.has(v),
  );

  blocksSet.clear();
  syncedBlocks = undefined;

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

  if (config.indexer.batchSize > 0) {
    for (let i = 0; i <= blocks.length; i += config.indexer.batchSize) {
      console.time('run');
      await indexer.run(api, blocks.slice(i, i + config.indexer.batchSize));
      console.timeEnd('run');
    }
  } else {
    await indexer.run(api, blocks);
  }
}

bootstrap()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
