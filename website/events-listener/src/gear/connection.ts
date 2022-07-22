import { GearApi } from '@gear-js/api';

import config from '../config/configuration';
import { eventListenerLogger } from '../common/event-listener.logger';
import { changeStatus } from '../routes/healthcheck/healthcheck.router';
import { listen } from './listener';
import { kafkaProducer } from '../kafka/producer';

export async function connectToGearNode() {
  const api: GearApi = new GearApi({
    providerAddress: config.api.provider,
    throwOnConnect: true,
  });
  api.isReadyOrError.catch(console.error);
  try {
    await api.isReady;
  } catch (error) {
    console.log('api.isReady', error);
  }
  changeStatus('ws');

  const chain = await api.chain();
  const genesis = api.genesisHash.toHex();
  const version = api.runtimeVersion.specVersion.toHuman();

  eventListenerLogger.info(`Connected to ${chain} with genesis ${genesis}. version: ${version}`);

  const unsub = await listen(api, genesis, ({ key, params, method }) => {
    kafkaProducer.send({ key, params, genesis, method });
  });

  return new Promise((resolve) => {
    api.on('error', (error) => {
      unsub();
      changeStatus('ws');
      resolve(error);
    });
  });
}
