import { GEAR_MNEMONIC_KEY, GEAR_STORAGE_KEY, JSONRPC_VERSION, RPC_METHODS } from 'consts';
import { BalanceModel, MessageModel, MetaModel, UploadProgramModel } from 'types/program';

export interface ISocketService {
  uploadProgram(file: File, opts: UploadProgramModel): void;
  getTotalIssuance(): void;
}

export class SocketService implements ISocketService {
  private readonly socket: any;

  private readonly key: string | null;

  constructor() {
    this.key = localStorage.getItem(GEAR_STORAGE_KEY);
  }

  private generateRandomId() {
    return Math.floor(Math.random() * 1000000000);
  }

  public uploadProgram(file: File, opts: UploadProgramModel) {
    /* eslint-disable @typescript-eslint/naming-convention */
    const { gasLimit, value, initPayload, init_input, init_output, input, output, types } = opts;
    const filename = file.name;
    const generatedId = this.generateRandomId();
    const keyPairJson = localStorage.getItem(GEAR_MNEMONIC_KEY) || '';
    console.log('123');
    const meta = {
      init_input,
      init_output,
      input,
      output,
      types,
    };

    return this.socket.emit('message', {
      jsonrpc: JSONRPC_VERSION,
      id: generatedId,
      method: RPC_METHODS.PROGRAM_UPLOAD,
      params: {
        file,
        filename,
        gasLimit,
        initPayload,
        value,
        meta,
        keyPairJson,
      },
    });
  }

  public getTotalIssuance() {
    const generatedId = this.generateRandomId();

    this.socket.emit('message', {
      jsonrpc: JSONRPC_VERSION,
      id: generatedId,
      method: RPC_METHODS.TOTAL_ISSUANCE,
    });
  }

  public transferBalance(balanceValue: BalanceModel) {
    const generatedId = this.generateRandomId();

    this.socket.emit('message', {
      jsonrpc: JSONRPC_VERSION,
      id: generatedId,
      method: RPC_METHODS.BALANCE_TRANSFER,
      params: balanceValue,
    });
  }

  public sendMessageToProgram(messageData: MessageModel) {
    const generatedId = this.generateRandomId();

    this.socket.emit('message', {
      jsonrpc: JSONRPC_VERSION,
      id: generatedId,
      method: RPC_METHODS.SEND_MESSAGE,
      params: messageData,
    });
  }

  public sendMetaToProgram(metaData: MetaModel, name: string, hash: string) {
    const generatedId = this.generateRandomId();

    this.socket.emit('message', {
      jsonrpc: JSONRPC_VERSION,
      id: generatedId,
      method: RPC_METHODS.SEND_META,
      params: {
        name,
        hash,
        ...metaData,
      },
    });
  }

  public getGasSpent(destination: string, payload: string) {
    const generatedId = this.generateRandomId();

    this.socket.emit('message', {
      jsonrpc: JSONRPC_VERSION,
      id: generatedId,
      method: RPC_METHODS.GET_GAS_SPENT,
      params: {
        destination,
        payload,
      },
    });
  }

  public getPayloadType(destination: string) {
    const generatedId = this.generateRandomId();

    this.socket.emit('message', {
      jsonrpc: JSONRPC_VERSION,
      id: generatedId,
      method: RPC_METHODS.GET_PAYLOAD_TYPE,
      params: {
        destination,
      },
    });
  }

  public readNotifications(id?: string) {
    const generatedId = this.generateRandomId();

    const params = id ? { id } : {};

    this.socket.emit('message', {
      jsonrpc: JSONRPC_VERSION,
      id: generatedId,
      method: RPC_METHODS.READ_EVENTS,
      params,
    });
  }
}
