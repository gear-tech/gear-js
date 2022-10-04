import { Producer } from 'kafkajs';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import configuration from '../config/configuration';

const configKafka = configuration().kafka;

export const KafkaProducerProvider = {
  provide: configKafka.producerName,
  useFactory: (): Promise<Producer> => {
    const kafkaClient = ClientProxyFactory.create({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: configKafka.clientId,
          brokers: configKafka.brokers,
          sasl: {
            mechanism: 'plain',
            username: configKafka.sasl.username,
            password: configKafka.sasl.password,
          },
        },
        producer: {
          allowAutoTopicCreation: true,
        }
      },
    });

    return kafkaClient.connect();
  },
};
