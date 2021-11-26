import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayInit } from '@nestjs/websockets';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { IdeService } from './ide.service';

const logger: Logger = new Logger('IdeGateway');

@WebSocketGateway({ namespace: '/ide' })
export class WsIdeGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(private readonly ideService: IdeService) {}

  handleConnection(client: any, ...args: any[]) {
    logger.log('Client connected');
  }

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    logger.log('Ide websocket started');
  }

  @SubscribeMessage('build')
  async buildWasm(client, payload: any) {
    logger.log('New build request');
    await this.ideService.build(client, payload, client.user.username);
  }
}
