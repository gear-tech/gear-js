import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { GearNodeService } from 'src/gear-node/gear-node.service';
import { ProgramsService } from 'src/programs/programs.service';

@WebSocketGateway({ namespace: '/api/ws' })
export class BlocksGateway implements OnGatewayInit {
  constructor(
    private gearService: GearNodeService,
    private programService: ProgramsService,
  ) {}

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('GearGateway');

  afterInit(server: any) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('subscribeNewBlocks')
  newBlocks(client: Socket) {
    this.gearService.subscribeNewHeads(client);
  }

  @SubscribeMessage('totalIssuance')
  totalIssuance(client: Socket) {
    this.gearService.totalIssuance(client);
  }

  @SubscribeMessage('uploadProgram')
  uploadProgram(client: Socket, data: any) {
    this.programService.uploadProgram(client, data.file);
  }
}
