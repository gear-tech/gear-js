import { KAFKA_TOPICS } from '@gear-js/common';

import { kafkaProducer } from '../../kafka/producer';
import { KafkaParams } from '../../kafka/types';

export async function networkKafkaPartitions(): Promise<void>{
  await kafkaProducer.sendByTopic(KAFKA_TOPICS.SERVICES_PARTITION, {} as KafkaParams);
}
