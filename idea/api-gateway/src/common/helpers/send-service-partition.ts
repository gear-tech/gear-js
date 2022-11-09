import { KafkaMessage } from 'kafkajs';
import { KAFKA_TOPICS } from '@gear-js/common';

import { getNewServicePartition, dataStoragePartitionsMap } from '../data-storage-partitions-map';
import { kafkaProducer } from '../../kafka/producer';

export async function sendServicePartition(message: KafkaMessage,topic: string): Promise<void>{
  const serviceGenesis = JSON.parse(message.value.toString());
  const correlationId = message.headers.kafka_correlationId.toString();
  const partitionServiceByGenesis = dataStoragePartitionsMap.get(serviceGenesis);
  const dataStoragesPartitions = Array.from(dataStoragePartitionsMap.values())
    .map(partition => Number(partition));
  const isAlreadyUsedPartition = containsDuplicates(dataStoragesPartitions);

  if(partitionServiceByGenesis && !isAlreadyUsedPartition) {
    await kafkaProducer.sendByTopic(KAFKA_TOPICS.SERVICE_PARTITION_GET,
      { routingPartition: partitionServiceByGenesis }, correlationId);
    return;
  }

  const partitionNewService = await getNewServicePartition(topic);

  dataStoragePartitionsMap.set(serviceGenesis, String(partitionNewService));
  await kafkaProducer.sendByTopic(KAFKA_TOPICS.SERVICE_PARTITION_GET,
    { routingPartition: String(partitionNewService) }, correlationId);
}

function containsDuplicates(array) {
  if (array.length !== new Set(array).size) {
    return true;
  }

  return false;
}
