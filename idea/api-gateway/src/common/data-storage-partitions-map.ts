import { initKafka } from '../kafka/init-kafka';
import { Channel } from 'amqplib';

const dataStoragePartitionsMap = new Map<string, string>();
const dataStoragesMap: Map<string, Channel> = new Map<string, Channel>();

async function getNewServicePartition (topic: string): Promise<number> {
  let sumPartitionsInApiGatewayService = 1;

  const admin = initKafka.admin();
  const topicOffsets = await admin.fetchTopicOffsets(topic);
  let partitionsInApiGatewayService: number[] = [];

  const sumPartitionsInKafka = topicOffsets.reduce((acc, topicData) => {
    return acc + topicData.partition;
  }, 1 as number);

  for(const [_, partition] of dataStoragePartitionsMap){
    const numPartition = Number(partition);

    sumPartitionsInApiGatewayService += numPartition;
    partitionsInApiGatewayService = [...partitionsInApiGatewayService, numPartition];
  }

  if(sumPartitionsInApiGatewayService < sumPartitionsInKafka && sumPartitionsInApiGatewayService !== 0) {
    const unusedPartitions = topicOffsets.filter((topicOffset) => (!partitionsInApiGatewayService.
      includes(topicOffset.partition)));

    return Math.min(...unusedPartitions.map(({ partition }) => partition));
  }

  if (sumPartitionsInApiGatewayService === sumPartitionsInKafka){
    const topics = await admin.listTopics();

    const partitionNewService = (sumPartitionsInKafka + 1);

    const topicPartitions = topics.map(topic => ({ topic, count: partitionNewService }));

    await admin.createPartitions({ topicPartitions });

    return partitionNewService;
  }
}

export { dataStoragePartitionsMap, getNewServicePartition, dataStoragesMap };
