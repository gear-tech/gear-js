import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AppService } from './app.service';

const logger = new Logger('WebSocket');

@WebSocketGateway()
export class WasmBuildGateway implements OnGatewayInit {
  constructor(private readonly appService: AppService) {}

  afterInit(server: any) {
    logger.log('Client connected');
  }

  @SubscribeMessage('build')
  async build(client: Socket, data: any) {
    const path = this.appService.unpackZip(
      data.file,
      data.projectName,
      data.username,
    );
    const result = await this.appService.processBuild(path);
    client.emit('build', {username: data.username, result})
  }
}
