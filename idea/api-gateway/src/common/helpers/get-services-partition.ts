import { KAFKA_TOPICS } from '@gear-js/common';

import { kafkaProducer } from '../../kafka/producer';

export async function getServicesPartition(): Promise<void>{
  await kafkaProducer.sendByTopic(KAFKA_TOPICS.SERVICES_PARTITION, '');
}
