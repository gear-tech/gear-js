import { KAFKA_TOPICS } from '@gear-js/common';

import { gearService } from '../gear';
import { kafkaProducer } from '../kafka/producer';

export async function sendGenesis(): Promise<void> {
  const genesisHash = gearService.getGenesisHash();

  await kafkaProducer.send(`${KAFKA_TOPICS.TEST_BALANCE_GENESIS}.reply`, genesisHash);
}
