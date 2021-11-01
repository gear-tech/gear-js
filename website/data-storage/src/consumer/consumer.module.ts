import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConsumerService } from './consumer.service';
import { MetadataModule } from 'src/metadata/metadata.module';
import { ProgramsModule } from 'src/programs/programs.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DATA_STORAGE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'data_storage',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'data_storage',
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
