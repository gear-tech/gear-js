import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

import configuration from 'src/config/configuration';
import { MetadataModule } from '../metadata/metadata.module';
import { ProgramsModule } from '../programs/programs.module';
import { MessagesModule } from '../messages/messages.module';
import { ConsumerService } from './consumer.service';

const configKafka = configuration().kafka;
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DATA_STORAGE',
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
            groupId: configKafka.groupId,
          },
        },
      },
    ]),
    MetadataModule,
    ProgramsModule,
    MessagesModule,
  ],
  controllers: [ConsumerController],
  providers: [ConsumerService],
})
export class ConsumerModule {}
