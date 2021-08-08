import { Logger, UseGuards } from '@nestjs/common';
import { OnGatewayInit } from '@nestjs/websockets';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsAuthGuard } from 'src/auth/guards/ws-auth.guard';
import { IdeService } from './ide.service';

@WebSocketGateway({ namespace: '/ide' })
export class WsIdeGateway implements OnGatewayInit {
  constructor(private readonly ideService: IdeService) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('IdeGateway');

  afterInit(server: any) {
    this.logger.log('Ide websocket started');
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('build')
  async buildWasm(client, payload: any) {
    await this.ideService.build(client, payload, client.user.username);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('upload')
  async uploadProgram(client, data: any) {
    this.ideService.uploadProgram(client, data, (error, result) => {
      if (error) {
        client.emit('upload', { error: error.message });
      } else {
        client.emit('upload', result);
      }
    });
  }
}
