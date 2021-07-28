import io from 'socket.io-client';
import { GEAR_LOCAL_WS_URI, GEAR_MNEMONIC_KEY, GEAR_STORAGE_KEY, JSONRPC_VERSION, PROGRAM_ERRRORS, PROGRAM_UPLOAD_STATUSES, RPC_METHODS, SOCKET_RESULT_STATUSES } from 'consts';
import { BalanceModel, MessageModel, UploadProgramModel } from 'types/program';
import { 
  fetchBlockAction, 
  fetchTotalIssuanceAction, 
  programUploadStatusAction,
  sendMessageStatusAction,
  handleProgramError,
  handleProgramSuccess} from 'store/actions/actions';

export interface ISocketService {
  uploadProgram(file: File, opts: UploadProgramModel): void;
  getTotalIssuance(): void;
  subscribeNewBlocks(): void;
}

export class SocketService implements ISocketService {

  private readonly socket: any;

  private readonly key: string | null;
  
  constructor(dispatch: any) {
    this.key = localStorage.getItem(GEAR_STORAGE_KEY);
    this.socket = io(GEAR_LOCAL_WS_URI, {
      transports: ['websocket'],
      query: { Authorization: `Bearer ${this.key || ""}` },
    });
    this.socket.on('message', (data: any) => {
      if (Object.prototype.hasOwnProperty.call(data, "result")) {
        if (Object.prototype.hasOwnProperty.call(data.result, "totalIssuance")) {
          dispatch(fetchTotalIssuanceAction(data.result))
        } else if (Object.prototype.hasOwnProperty.call(data.result, "hash")) {
          dispatch(fetchBlockAction(data.result))
        } else if (Object.prototype.hasOwnProperty.call(data.result, "status")) {
          if (data.result.status === SOCKET_RESULT_STATUSES.IN_BLOCK) {
            dispatch(programUploadStatusAction(PROGRAM_UPLOAD_STATUSES.IN_BLOCK));
          } else if (data.result.status === SOCKET_RESULT_STATUSES.FINALIZED) {
            dispatch(programUploadStatusAction(PROGRAM_UPLOAD_STATUSES.FINALIZED));
          } else if (data.result.status === SOCKET_RESULT_STATUSES.PROGRAM_INITIALIZED) {
            dispatch(programUploadStatusAction(PROGRAM_UPLOAD_STATUSES.PROGRAM_INITIALIZED));
          } else if (data.result.status === SOCKET_RESULT_STATUSES.SUCCESS) {
            dispatch(handleProgramSuccess());
          } else if (data.result.status === SOCKET_RESULT_STATUSES.LOG) {
            dispatch(sendMessageStatusAction({
              status: data.result.status,
              blockHash: data.result.blockHash,
              data: data.result.data
            }))
          }
        }
      } else if (Object.prototype.hasOwnProperty.call(data, "error")) {
        if (Object.prototype.hasOwnProperty.call(data.error, "message")) {
          const uploadErrors = Object.values(PROGRAM_ERRRORS).map(value => value.toLowerCase());
          if (uploadErrors.includes(data.error.message.toLowerCase())) {
            dispatch(handleProgramError(data.error.message));
          }
        }
      }
    })
  }

  private generateRandomId() {
    return Math.floor(Math.random() * 1000000000);
  }

  public uploadProgram(file: File, opts: UploadProgramModel) {
    const { gasLimit, value, initPayload } = opts;
    const filename = file.name;
    const generatedId = this.generateRandomId();
    const keyPairJson = localStorage.getItem(GEAR_MNEMONIC_KEY) || '';

    return this.socket.emit('message', {
      jsonrpc: JSONRPC_VERSION,
      id: generatedId,
      method: RPC_METHODS.PROGRAM_UPLOAD,
      params: {
        file,
        filename,
        gasLimit,
        value,
        initPayload,
        keyPairJson
      }
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

  public subscribeNewBlocks() {
    const generatedId = this.generateRandomId();

    this.socket.emit('message', {
      jsonrpc: JSONRPC_VERSION,
      id: generatedId,
      method: RPC_METHODS.SUBSCRIBE_BLOCKS,
    });
  }

  public transferBalance(balanceValue: BalanceModel) {
    const generatedId = this.generateRandomId();

    this.socket.emit('message', {
      jsonrpc: JSONRPC_VERSION,
      id: generatedId,
      method: RPC_METHODS.BALANCE_TRANSFER,
      params: balanceValue
    })
  }

  public sendMessageToProgram(messageData: MessageModel) {
    const generatedId = this.generateRandomId();

    this.socket.emit('message', {
      jsonrpc: JSONRPC_VERSION,
      id: generatedId,
      method: RPC_METHODS.SEND_MESSAGE,
      params: messageData
    })
  }
}