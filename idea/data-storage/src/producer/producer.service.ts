import { Inject, Injectable } from '@nestjs/common';
import { Message, Producer } from 'kafkajs';
import { nanoid } from 'nanoid';
import { KAFKA_TOPICS } from '@gear-js/common';

import { kafkaEventMap } from '../common/kafka-event.map';
import { kafkaNetworkData } from '../common/kafka-network-data';
import configuration from '../config/configuration';

const configKafka = configuration().kafka;

@Injectable()
export class ProducerService {
  constructor(@Inject(configKafka.producerName) private kafkaProducer: Producer) {}

  public async sendByTopic(topic: string, params: any): Promise<void> {
    const message: Message = { value: JSON.stringify(params), partition: kafkaNetworkData.partition };

    await this.kafkaProducer.send({
      topic,
      messages: [message]
    });
  }

  public async setKafkaNetworkData(): Promise<void> {
    const correlationId = nanoid();

    const message: Message = { value: JSON.stringify(kafkaNetworkData.genesis), headers: {
      kafka_correlationId: correlationId,
    } };

    await this.kafkaProducer.send({
      topic: `${KAFKA_TOPICS.SERVICE_PARTITION_GET}.reply`,
      messages: [message],
    });

    let topicEvent;
    const res: Promise<any> = new Promise((resolve) => (topicEvent = resolve));
    kafkaEventMap.set(correlationId, topicEvent);

    const networkData = await res;

    if(networkData.routingPartition !== null) {
      kafkaNetworkData.partition = Number(networkData.routingPartition);
    }
  }
}
