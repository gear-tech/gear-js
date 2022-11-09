import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

import configuration from '../config/configuration';
import { MetadataModule } from '../metadata/metadata.module';
import { ProgramModule } from '../program/program.module';
import { MessageModule } from '../message/message.module';
import { ConsumerService } from './consumer.service';
import { CodeModule } from '../code/code.module';
import { ProducerModule } from '../producer/producer.module';
import { BlockModule } from '../block/block.module';

const configKafka = configuration().kafka;

@Module({
  imports: [
    ProducerModule,
    ClientsModule.register([
      {
        name: configKafka.consumerName,
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
          consumer: {
            maxBytesPerPartition: 10485760,
            groupId: configKafka.groupId,
          },
        },
      },
    ]),
    MetadataModule,
    ProgramModule,
    MessageModule,
    CodeModule,
    BlockModule,
  ],
  controllers: [ConsumerController],
  providers: [ConsumerService],
})
export class ConsumerModule {}
