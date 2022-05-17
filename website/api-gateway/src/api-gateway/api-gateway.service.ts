import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { RpcMessageHandler } from 'src/json-rpc/handler';
import { Logger } from '@nestjs/common';
import {
  AddMetaParams,
  AddPayloadParams,
  FindMessageParams,
  FindProgramParams,
  GetAllProgramsParams,
  GetIncomingMessagesParams,
  GetMessagesParams,
  GetMetaParams,
  GetOutgoingMessagesParams,
  GetTestBalanceParams,
  GetAllUserProgramsParams,
} from '@gear-js/interfaces';
import config from 'src/config/configuration';
import { changeStatus } from 'src/healthcheck/healthcheck.controller';

const logger = new Logger('ApiGatewayService');
const configKafka = config().kafka;

@Injectable()
export class ApiGatewayService extends RpcMessageHandler implements OnModuleInit {
  constructor() {
    super();
    console.log(config().kafka.brokers);
  }

  @Client({
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
  })
  client: ClientKafka;

  patterns = [
    'program.data',
    'meta.add',
    'meta.get',
    'program.all',
    'program.all.user',
    'message.all',
    'message.data',
    'message.add.payload',
    'testBalance.get',
  ];

  async onModuleInit() {
    this.patterns.forEach((key) => {
      this.client.subscribeToResponseOf(key);
    });
    this.client.connect().then(() => {
      logger.log('Connection initialized');
      changeStatus('kafka');
    });
  }

  methods = {
    program: {
      data: (params: FindProgramParams) => {
        return this.client.send('program.data', params);
      },
      addMeta: (params: AddMetaParams) => {
        return this.client.send('meta.add', params);
      },
      getMeta: (params: GetMetaParams) => {
        return this.client.send('meta.get', params);
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
      allUser: (params: GetAllUserProgramsParams) => {
        return this.client.send('program.all.user', params);
      },
    },
    message: {
      all: (params: GetMessagesParams) => {
        return this.client.send('message.all', params);
      },
      data: (params: FindMessageParams) => {
        return this.client.send('message.data', params);
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
    },
    testBalance: {
      get: (params: GetTestBalanceParams) => {
        return this.client.send('testBalance.get', params);
      },
    },
  };
}
