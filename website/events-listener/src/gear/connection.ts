import { GearApi } from '@gear-js/api';
import { KAFKA_TOPICS } from '@gear-js/common';

import config from '../config/configuration';
import { eventListenerLogger } from '../common/event-listener.logger';
import { changeStatus } from '../routes/healthcheck/healthcheck.router';
import { listen } from './listener';
import { kafkaProducer } from '../kafka/producer';
import { SendByKafkaTopicInput } from '../kafka/types';

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

  eventListenerLogger.info(`Connected to ${chain} with genesis ${genesis}`);

  const unsub = await listen(api, genesis, ({ key, value }) => {
    const sendByKafkaTopicInput: SendByKafkaTopicInput = {
      topic: KAFKA_TOPICS.EVENTS,
      key,
      params: value,
      genesis,
    };
    kafkaProducer.send(sendByKafkaTopicInput);
  });

  return new Promise((resolve) => {
    api.on('error', (error) => {
      unsub();
      changeStatus('ws');
      resolve(error);
    });
  });
}
