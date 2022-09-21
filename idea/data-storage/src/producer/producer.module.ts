import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import configuration from '../config/configuration';

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
  ],
  controllers: [],
  providers: [ProducerService],
})
export class ProducerModule {}
