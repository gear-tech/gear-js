import { waitReady } from '@polkadot/wasm-crypto';
import { RMQServiceAction, logger } from '@gear-js/common';

import { changeStatus, runHealthcheckServer } from './healthcheck.server';
import { AppDataSource } from './database';
import { RMQService } from './rmq';
import { BlockService } from './services';
import { CodeService } from './services';
import { MessageService } from './services';
import { ProgramService } from './services';
import { StateService } from './services';
import { GearIndexer, connectToNode } from './gear';
import { GearHelper } from './gear';

async function bootstrap() {
  runHealthcheckServer();

  const dataSource = await AppDataSource.initialize();

  logger.info('DB connection established');

  changeStatus('database');

  await waitReady();

  const helper = new GearHelper();

  const blockService = new BlockService(dataSource);
  const codeService = new CodeService(dataSource);
  const programService = new ProgramService(dataSource);
  const stateService = new StateService(dataSource, programService);
  const messageService = new MessageService(dataSource, programService);

  const rmq = new RMQService(blockService, codeService, messageService, programService, stateService);

  await rmq.init();
  changeStatus('rmq');

  const indexer = new GearIndexer(programService, messageService, codeService, blockService, rmq);

  await connectToNode(indexer, async (action, genesis) => {
    if (action === RMQServiceAction.ADD) {
      await rmq.addGenesisQueue(genesis);
    } else {
      await rmq.deleteGenesisQueue(genesis);
    }
  });
  helper.initialize(indexer);
}

bootstrap();
