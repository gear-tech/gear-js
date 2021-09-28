import io from 'socket.io-client';
import {
  GEAR_LOCAL_WS_URI,
  GEAR_MNEMONIC_KEY,
  GEAR_STORAGE_KEY,
  JSONRPC_VERSION,
  PROGRAM_ERRRORS,
  PROGRAM_UPLOAD_STATUSES,
  RPC_METHODS,
  SOCKET_RESULT_STATUSES,
  EVENT_TYPES,
  GEAR_BALANCE_TRANSFER_VALUE} from 'consts';
import { BalanceModel, MessageModel, MetaModel, UploadProgramModel } from 'types/program';
import {
  fetchBlockAction,
  fetchTotalIssuanceAction,
  programStatusAction,
  handleProgramError,
  handleProgramSuccess,
  fetchRecentNotificationSuccessAction,
  fetchProgramPayloadTypeAction,
  fetchGasAction,
  getUnreadNotificationsCount} from 'store/actions/actions';

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
          if (Object.prototype.hasOwnProperty.call(data.result, "uploadedAt")) {
            alert("Meta data uploaded")
          }
        } else if (Object.prototype.hasOwnProperty.call(data.result, "status")) {
          if (data.result.status === SOCKET_RESULT_STATUSES.IN_BLOCK) {
            dispatch(programStatusAction(PROGRAM_UPLOAD_STATUSES.IN_BLOCK));
          } else if (data.result.status === SOCKET_RESULT_STATUSES.FINALIZED) {
            dispatch(programStatusAction(PROGRAM_UPLOAD_STATUSES.FINALIZED));
            dispatch(handleProgramSuccess());
          }
        } else if (Object.prototype.hasOwnProperty.call(data.result, "type")) {
          if (data.result.type === EVENT_TYPES.PROGRAM_INITIALIZED ||
            data.result.type === EVENT_TYPES.PROGRAM_INITIALIZATION_FAILURE ||
            data.result.type === EVENT_TYPES.LOG) {
            dispatch(fetchRecentNotificationSuccessAction(data.result))
            dispatch(getUnreadNotificationsCount());
          }
        } else if (Object.prototype.hasOwnProperty.call(data.result, "payloadType")) {
          dispatch(fetchProgramPayloadTypeAction(data.result.payloadType))
        } else if (Object.prototype.hasOwnProperty.call(data.result, "gasSpent")) {
          dispatch(fetchGasAction(data.result.gasSpent));
        }
      } else if (Object.prototype.hasOwnProperty.call(data, "error")) {
        if (Object.prototype.hasOwnProperty.call(data.error, "message")) {
          const uploadErrors = Object.values(PROGRAM_ERRRORS).map(value => value.toLowerCase());
          if (uploadErrors.includes(data.error.message.toLowerCase())) {
            dispatch(handleProgramError(data.error.message));
            if (data.error.message.toLowerCase() === PROGRAM_ERRRORS.BALANCE_LOW.toLowerCase()) {
              this.transferBalance({
                value: GEAR_BALANCE_TRANSFER_VALUE
              })
            }
          }
        }
      }
    })
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

    const meta = {
      init_input,
      init_output,
      input,
      output,
      types
    }

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

  public subscribeEvents() {
    const generatedId = this.generateRandomId();

    this.socket.emit('message', {
      jsonrpc: JSONRPC_VERSION,
      id: generatedId,
      method: RPC_METHODS.SUBSCRIBE_EVENTS,
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

  public sendMetaToProgram(metaData: MetaModel, name: string, hash: string) {
    const generatedId = this.generateRandomId();

    this.socket.emit("message", {
      jsonrpc: JSONRPC_VERSION,
      id: generatedId,
      method: RPC_METHODS.SEND_META,
      params: {
        name,
        hash,
        ...metaData
      }
    })
  }

  public getGasSpent(destination: string, payload: string) {
    const generatedId = this.generateRandomId();

    this.socket.emit('message', {
      jsonrpc: JSONRPC_VERSION,
      id: generatedId,
      method: RPC_METHODS.GET_GAS_SPENT,
      params: {
        destination,
        payload
      }
    })
  }

  public getPayloadType(destination: string) {
    const generatedId = this.generateRandomId();

    this.socket.emit('message', {
      jsonrpc: JSONRPC_VERSION,
      id: generatedId,
      method: RPC_METHODS.GET_PAYLOAD_TYPE,
      params: {
        destination
      }
    })
  }

  public readNotifications(id?: string) {
    const generatedId = this.generateRandomId();

    const params = id ? {id} : {};

    this.socket.emit('message', {
      jsonrpc: JSONRPC_VERSION,
      id: generatedId,
      method: RPC_METHODS.READ_EVENTS,
      params
    })
  }
}