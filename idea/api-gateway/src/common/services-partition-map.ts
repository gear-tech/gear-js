import { initKafka } from '../kafka/init-kafka';

const servicesPartitionMap = new Map<string, string>();

async function getNewServicePartition (topic: string): Promise<number> {
  let sumPartitionsInApiGatewayService = 0;

  const admin = initKafka.admin();
  const topicOffsets = await admin.fetchTopicOffsets(topic);

  const sumPartitionsInKafka = topicOffsets.reduce((acc, topicData) => {
    return acc + topicData.partition;
  }, 0 as number);

  for(const el of servicesPartitionMap){
    const [_, partition] = el;
    sumPartitionsInApiGatewayService += Number(partition);
  }

  if(sumPartitionsInApiGatewayService < sumPartitionsInKafka && sumPartitionsInApiGatewayService !== 0) {
    return sumPartitionsInApiGatewayService + 1;
  }

  if (sumPartitionsInApiGatewayService === sumPartitionsInKafka){
    const topics = await admin.listTopics();

    const partitionNewService = sumPartitionsInKafka + 1;
    const topicPartitions = topics.map(topic => ({ topic, count: partitionNewService }));

    await admin.createPartitions({ topicPartitions });

    return partitionNewService;
  }

  return 1;
}

export { servicesPartitionMap, getNewServicePartition };
