import { Inject, Module } from '@nestjs/common';
import { Producer } from 'kafkajs';

import { ProducerService } from './producer.service';
import configuration from '../config/configuration';
import { KafkaProducerProvider } from './producer.provider';

const configKafka = configuration().kafka;

@Module({
  imports: [],
  controllers: [],
  providers: [ProducerService, KafkaProducerProvider],
  exports: [ProducerService]
})
export class ProducerModule{
  constructor(@Inject(configKafka.producerName) private kafkaProducer: Producer) {}
}
