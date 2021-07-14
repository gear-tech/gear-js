import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WsAuthGuard } from 'src/ws-rpc/guards/ws-auth.guard';
import { WsRpcMessageHandler } from './ws-rpc.handler';
import { Socket, Server } from 'socket.io';
import { WsExceptionFilter } from './ws-rpc.exceptions';

@WebSocketGateway({ namespace: '/api/ws' })
export class WsRpcGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly rpcHandler: WsRpcMessageHandler) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('GearGateway');

  afterInit(server: any) {
    this.logger.log('Initialized!');
  }

  @UseGuards(WsAuthGuard)
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('Client connected');
  }

  handleDisconnect(client: Socket) {
    this.rpcHandler.unsubscribe();
  }

  @UseFilters(WsExceptionFilter)
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any) {
    this.rpcHandler.requestMessage(client, payload);
  }
}
