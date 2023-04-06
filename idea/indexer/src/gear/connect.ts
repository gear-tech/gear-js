import { GearApi } from '@gear-js/api';
import { RMQServiceActions } from '@gear-js/common';

import config from '../config';
import { changeStatus } from '../healthcheck';
import { GenesisCb, logger } from '../common';
import { GearIndexer } from './indexer';

const MAX_RECONNECTIONS = 10;
let reconnectionsCounter = 0;

export async function connectToNode(indexer: GearIndexer, cb: GenesisCb) {
  const api = new GearApi({ providerAddress: config.gear.wsProvider });
  try {
    await api.isReadyOrError;
  } catch (error) {
    logger.error(`Failed to connect to ${config.gear.wsProvider}`);
  }
  await api.isReady;
  const genesis = api.genesisHash.toHex();

  api.on('disconnected', () => {
    reconnect(api, genesis, indexer, cb);
  });

  reconnectionsCounter = 0;

  indexer.run(api);
  cb(RMQServiceActions.ADD, genesis);

  logger.info(`⚙️ Connected to ${api.runtimeChain} with genesis ${genesis}`);
  changeStatus('gear');
}

async function reconnect(api: GearApi, genesis: string, indexer: GearIndexer, cb: GenesisCb) {
  changeStatus('gear');

  cb(RMQServiceActions.DELETE, genesis);

  indexer.stop();
  try {
    await api.disconnect();
  } catch (err) {
    console.log(err);
  }
  reconnectionsCounter++;

  if (reconnectionsCounter > MAX_RECONNECTIONS) {
    throw new Error(`Unable to connect to ${config.gear.wsProvider}`);
  }

  logger.info('⚙️ 📡 Reconnecting to the gear node...');

  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  return connectToNode(indexer, cb);
}
