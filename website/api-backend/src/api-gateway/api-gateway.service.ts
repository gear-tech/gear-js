import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { RpcMessageHandler } from 'src/json-rpc/handler';
import { Logger } from '@nestjs/common';
import { Observable } from 'rxjs';

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
        clientId: 'gear-storage',
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
      data: (params: { id: string; chain: string }): Observable<any> => {
        return this.client.send('program.data', params);
      },
      addMeta: (params: {
        chain: string;
        programId: string;
        signature: string;
        meta: string | any;
        name?: string;
        title?: string;
      }) => {
        return this.client.send('meta.add', params);
      },
      getMeta: (params: { chain: string; programId: string }) => {
        return this.client.send('meta.get', params);
      },
      all: (params: { chain: string; limit?: number; offset?: number }) => {
        return this.client.send('program.all', params);
      },
      allUser: (params: {
        chain: string;
        owner: string;
        limit?: number;
        offset?: number;
      }) => {
        return this.client.send('program.all', params);
      },
    },
    message: {
      all: (params: {
        chain: string;
        destination?: string;
        source?: string;
        isRead?: boolean;
        limit?: number;
        offset?: number;
      }) => {
        return this.client.send('message.all', params);
      },
      incoming: (params: {
        chain: string;
        destination?: string;
        isRead?: boolean;
        limit?: number;
        offset?: number;
      }) => {
        return this.client.send('message.all', params);
      },
      outgoing: (params: {
        chain: string;
        source?: string;
        isRead?: boolean;
        limit?: number;
        offset?: number;
      }) => {
        return this.client.send('message.all', params);
      },
      savePayload: (params: {
        id: string;
        chain: string;
        payload: string;
        signature: string;
      }) => {
        return this.client.send('message.add.payload', params);
      },
      countUnread: () => {},
    },
    balance: {
      topUp: () => {},
    },
  };
}
