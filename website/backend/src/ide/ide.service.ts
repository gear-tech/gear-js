import { Injectable, Logger } from '@nestjs/common';
import { GearNodeService } from 'src/gear-node/gear-node.service';
import { io, Socket } from 'socket.io-client';

const logger = new Logger('Ide Service');
@Injectable()
export class IdeService {
  connectedClients: Map<string, Socket>;
  socket;
  constructor(private readonly gearService: GearNodeService) {
    this.connectedClients = new Map();
    this.socket = io(process.env.IDE_SOCKET, {
      transports: ['websocket'],
    });
    this.onConnection();
  }

  async build(client, payload, username) {
    this.connectedClients.set(username, client);
    this.socket.emit('build', {
      file: payload.file,
      projectName: payload.projectName,
      username,
    });
  }

  async onConnection() {
    this.socket.on('connect', () => {
      logger.log('Connected to ide websocket');
    });
    this.socket.on('build', (data) => {
      console.log(data);
      this.connectedClients.get(data.username).emit('build', data.result);
      this.connectedClients.delete(data.username);
    });
  }

  async uploadProgram(user, data, callback) {
    this.gearService.uploadProgram(user, data, callback);
  }
}
