import { KafkaMessage } from 'kafkajs';
import { KAFKA_TOPICS } from '@gear-js/common';

import { getNewServicePartition, servicesPartitionMap } from '../services-partition-map';
import { kafkaProducer } from '../../kafka/producer';

export async function sendServicePartition(message: KafkaMessage,topic: string): Promise<void>{
  const serviceGenesis = JSON.parse(message.value.toString());
  const correlationId = message.headers.kafka_correlationId.toString();
  const partitionServiceByGenesis = servicesPartitionMap.get(serviceGenesis);

  if(partitionServiceByGenesis) {
    await kafkaProducer.sendByTopic(KAFKA_TOPICS.SERVICE_PARTITION_GET, partitionServiceByGenesis, correlationId);
    return;
  }

  const partitionNewService = getNewServicePartition(topic);

  await servicesPartitionMap.set(serviceGenesis, String(partitionNewService));
  await kafkaProducer.sendByTopic(KAFKA_TOPICS.SERVICE_PARTITION_GET, String(partitionNewService), correlationId);
}
