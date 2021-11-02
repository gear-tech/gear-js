import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { RpcMessageHandler } from 'src/json-rpc/handler';
import { Logger } from '@nestjs/common';
import {
  AddMetaParams,
  AddPayloadParams,
  FindProgramParams,
  GetAllProgramsParams,
  GetIncomingMessagesParams,
  GetMessagesParams,
  GetMetaParams,
  GetOutgoingMessagesParams,
} from '@gear-js/backend-interfaces';

const logger = new Logger('ApiGatewayService');

@Injectable()
export class ApiGatewayService extends RpcMessageHandler implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'gear-storage',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'gear-storage',
      },
    },
  })
  client: ClientKafka;

  patterns = ['meta.add', 'program.data', 'meta.get', 'program.all', 'message.all', 'message.add.payload'];

  async onModuleInit() {
    this.patterns.forEach((key) => {
      this.client.subscribeToResponseOf(key);
    });
    await this.client.connect();
    logger.log('Connection initialized');
  }

  methods = {
    program: {
      data: (params: FindProgramParams) => {
        return this.client.send('program.data', params);
      },
      meta: {
        add: (params: AddMetaParams) => {
          return this.client.send('meta.add', params);
        },
        get: (params: GetMetaParams) => {
          return this.client.send('meta.get', params);
        },
      },
      all: (params: GetAllProgramsParams) => {
        return this.client.send('program.all', params);
      },
      allUser: (params: GetAllProgramsParams) => {
        return this.client.send('program.all', params);
      },
    },
    message: {
      all: (params: GetMessagesParams) => {
        return this.client.send('message.all', params);
      },
      incoming: (params: GetIncomingMessagesParams) => {
        return this.client.send('message.all', params);
      },
      outgoing: (params: GetOutgoingMessagesParams) => {
        return this.client.send('message.all', params);
      },
      savePayload: (params: AddPayloadParams) => {
        return this.client.send('message.add.payload', params);
      },
      countUnread: () => {},
    },
    balance: {
      topUp: () => {},
    },
  };
}
