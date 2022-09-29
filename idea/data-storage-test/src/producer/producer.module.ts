import { Inject, Module } from '@nestjs/common';

import { ProducerService } from './producer.service';
import { KafkaProducerProvider } from './producer.provider';
import { Producer } from 'kafkajs';

@Module({
  imports: [],
  controllers: [],
  providers: [ProducerService, KafkaProducerProvider],
  exports: [ProducerService]
})
export class ProducerModule{
  constructor(@Inject('DATA_STORAGE_KAFKA_PRODUCER') private kafkaProducer: Producer) {}
}
