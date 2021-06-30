import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger, Req, UseGuards } from '@nestjs/common';
import { GearNodeService } from 'src/gear-node/gear-node.service';
import { WsAuthGuard } from './guards/ws-auth.guard';

@WebSocketGateway({ namespace: '/api/ws' })
export class BlocksGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private gearService: GearNodeService) {}

  newBlocksUnsub = null;

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('GearGateway');

  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  @UseGuards(WsAuthGuard)
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('Client connected');
  }

  handleDisconnect(client: any) {
    this.logger.log('Client disconnected');
    if (this.newBlocksUnsub) {
      this.newBlocksUnsub();
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('subscribeNewBlocks')
  async newBlocks(client: Socket) {
    this.newBlocksUnsub = await this.gearService.subscribeNewHeads(client);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('totalIssuance')
  totalIssuance(client: Socket, data: any) {
    this.gearService.totalIssuance(client);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('uploadProgram')
  uploadProgram(client: Socket, data: any) {
    const cb = (error?, result?) => {
      if (error) {
        client.emit('submitProgram.failed', {
          error: error.error,
          message: error.message,
        });
      } else {
        client.emit('submitProgram.success', {
          status: result.status,
          blockHash: result.blockHash,
          programHash: result.programHash,
        });
      }
    };
    this.gearService.uploadProgram(client.user, data, cb);
  }
}
