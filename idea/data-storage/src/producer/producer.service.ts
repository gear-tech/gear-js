import { Inject, Injectable } from '@nestjs/common';
import { Message, Producer } from 'kafkajs';
import { nanoid } from 'nanoid';
import { KAFKA_TOPICS } from '@gear-js/common';

import { kafkaEventMap } from '../common/kafka-event.map';
import { SERVICE_DATA } from '../common/service-data';

@Injectable()
export class ProducerService {
  constructor(@Inject('DATA_STORAGE_KAFKA_PRODUCER') private kafkaProducer: Producer) {}

  public async sendByTopic(topic: string, params: any): Promise<void> {
    const message: Message = { value: JSON.stringify(params) };

    await this.kafkaProducer.send({
      topic:  `${KAFKA_TOPICS.SERVICES_PARTITION}.reply`,
      messages: [message]
    });
  }

  public async getPartitionServiceMessage(): Promise<void> {
    const correlationId = nanoid();

    const message: Message = { value: JSON.stringify(SERVICE_DATA.genesis), headers: {
      kafka_correlationId: correlationId,
    } };

    await this.kafkaProducer.send({
      topic: `${KAFKA_TOPICS.SERVICE_PARTITION_GET}.reply`,
      messages: [message],
    });

    let topicEvent;
    const res: Promise<any> = new Promise((resolve) => (topicEvent = resolve));
    kafkaEventMap.set(correlationId, topicEvent);

    SERVICE_DATA.partition = Number(await res);
  }
}
