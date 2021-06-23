import { io, Socket } from 'socket.io-client';
import { emitEvents, GEAR_LOCAL_WS_URI, GEAR_MNEMONIC_KEY, GEAR_STORAGE_KEY } from 'consts';

export interface ISocketService {
  uploadProgram(file: File): void
}

export class SocketService implements ISocketService{
  private readonly socket: Socket;

  private readonly key: string | null;

  constructor() {
    this.key = localStorage.getItem(GEAR_STORAGE_KEY);
    this.socket = io(GEAR_LOCAL_WS_URI, {
      query: { Authorization: this.key || "" },
    });
  }

  public uploadProgram(file: File) {
    return this.socket.emit(emitEvents.uploadProgram, {
      file,
      filename: file.name,
      gasLimit: 2,
      value: 2,
      initPayload: '',
      mnemonic: localStorage.getItem(GEAR_MNEMONIC_KEY) || '',
    });
  }
}