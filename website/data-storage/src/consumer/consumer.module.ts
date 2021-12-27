import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConsumerService } from './consumer.service';
import { MetadataModule } from 'src/metadata/metadata.module';
import { ProgramsModule } from 'src/programs/programs.module';
import { MessagesModule } from 'src/messages/messages.module';
import configuration from 'src/config/configuration';

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
