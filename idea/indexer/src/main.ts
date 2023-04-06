import { waitReady } from '@polkadot/wasm-crypto';
import { RMQServiceActions } from '@gear-js/common';

import { changeStatus, runHealthcheckServer } from './healthcheck';
import { AppDataSource } from './database';
import { RMQService } from './rabbitmq';
import { BlockService } from './services';
import { CodeService } from './services';
import { MessageService } from './services';
import { ProgramService } from './services';
import { MetaService } from './services';
import { StateService } from './services';
import { GearIndexer, connectToNode } from './gear';
import { GearHelper } from './gear/helper';

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
  const stateService = new StateService(dataSource, programService);
  const messageService = new MessageService(dataSource, programService);

  const rmq = new RMQService(blockService, codeService, messageService, metaService, programService, stateService);

  await rmq.init();
  changeStatus('rmq');

  const indexer = new GearIndexer(programService, messageService, codeService, blockService, metaService);

  await connectToNode(indexer, async (action, genesis) => {
    if (action === RMQServiceActions.ADD) {
      await rmq.addGenesisQueue(genesis);
    } else {
      await rmq.deleteGenesisQueue(genesis);
    }
  });
  helper.initialize(indexer);
}

bootstrap();
