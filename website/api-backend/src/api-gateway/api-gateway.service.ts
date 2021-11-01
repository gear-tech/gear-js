import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { RpcMessageHandler } from 'src/json-rpc/handler';
import { Logger } from '@nestjs/common';

const logger = new Logger('ApiGatewayService');

@Injectable()
export class ApiGatewayService
  extends RpcMessageHandler
  implements OnModuleInit
{
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'api-gateway',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'gear-storage',
      },
    },
  })
  client: ClientKafka;

  patterns = ['add.meta', 'program.data'];

  async onModuleInit() {
    this.patterns.forEach((key) => {
      this.client.subscribeToResponseOf(key);
    });
    await this.client.connect();
    logger.log('Connection initialized');
  }

  methods = {
    program: {
      data: async (params: { id: string; chain: string }) => {
        const result = this.client.send('program.data', {
          id: params.id,
          chain: params.chain,
        });
        console.log(result);
      },
      addMeta: async () => {},
      getMeta: async () => {},
      all: async () => {},
      allUser: async () => {},
    },
    message: {
      all: async () => {},
      savePayload: async () => {},
      countUnread: async () => {},
    },
    balance: {
      topUp: async () => {},
    },
  };
}
